import React, {useState} from 'react';
import XLSX from 'xlsx';

////////////////////////
/// IMPORT COMPONENT ///
////////////////////////

export function Import() {

    /////////////
    /// STATE ///
    /////////////
	const [data, setData] = useState([]);
	const [cols, setCols] = useState([]);

    //////////////////////////////
    /// READ FILE AND SET DATA ///
    //////////////////////////////
	const handleFile = (file) => {
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {

			// Parse data
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});

			// Get first worksheet
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];

			// Convert array of arrays
			const data = XLSX.utils.sheet_to_json(ws, {header:1});

			// Update state 
            const dataFields = data.shift()
			setData(data);
			setCols(makeFieldsArray(dataFields))
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
	}

    ////////////////////////////
    /// CREATE EXPORTED FILE ///
    ////////////////////////////
	const exportFile = () => {

		// convert state to workbook 
		const ws = XLSX.utils.aoa_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "FileName");

		// generate XLSX file and send to client
		XLSX.writeFile(wb, "importedData.csv")
	};

    ///////////////////////////////
    /// IMPORT COMPONENT RENDER ///
    ///////////////////////////////
	return (
        <section id="appContent" className="importContent">

            <div className="importHeader">
                
                Header

                {/* DRAGZONE */}
                <div className="flexBetweenCenter">

                    <DragDropFile handleFile={handleFile}>

                        {/* INPUT */}
                        
                        <DataInput handleFile={handleFile} />
                           
                        Supported file : "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
                      
                    </DragDropFile>

                {/* EXPORT BUTTON EXEMPLE */}
                
                    <button disabled={!data.length} className="btn btn-success" onClick={exportFile}>Export</button>
           
                </div>
				
                    
            </div>

  
            <OutTable data={data} cols={cols} />
    
            
        </section>
	);
}


/* -------------------------------------------------------------------------- */

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/

function DragDropFile({ handleFile, children }) {

    //GET CLASS DRAG OVER
    const [classOver, setclassOver] = useState(null);

    //STOP PROPAGATION
	const suppress = (e) => {
        e.stopPropagation(); 
        e.preventDefault();
        if(!classOver){setclassOver("importDragOver")}
    };

    //GET FILE
	const handleDrop = (e) => { 
        e.stopPropagation(); e.preventDefault();
		const files = e.dataTransfer.files;
		if(files && files[0]){
            handleFile(files[0]);
        }
        setclassOver(null);
	};

	return (
		<div 
			onDrop={handleDrop} 
			onDragEnter={suppress} 
            onDragLeave={() => setclassOver(null)}
			onDragOver={suppress}
            className={classOver? classOver  : "importDragInit" }
		>
		{children}
		</div>
	);
}

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/

function DataInput({ handleFile }) {
	const handleChange = (e) => {
		const files = e.target.files;
		if(files && files[0]) handleFile(files[0]);
	};

	return (
		<form className="form-inline">
			<div className="form-group">
				<label htmlFor="file">Drag or choose a spreadsheet file</label>
				<br />
				<input 
					type="file" 
					className="form-control" 
					id="file" 
					accept={SUPPORTED_FILE_TYPE} 
					onChange={handleChange} 
				/>
			</div>
		</form>
	)
}

/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
function OutTable({ data, cols }) {
	return (
        <div className="importTable">
			<table className="table table-striped">
				<thead>
					<tr>
                        {cols.map((c) => 
                            <th key={c.key} style={{position:"sticky",top:0, backgroundColor:"white"}}>
                                <div className="importTableHeader">
                                    {c.name}
                                </div>
                            </th>
                        )}
                    </tr>
				</thead>
				<tbody>
					{data.map((r,i) => <tr key={i}>
						{cols.map(c => <td key={c.key}>{ r[c.key] }</td>)}
					</tr>)}
				</tbody>
			</table>
            </div>
	);
}

/* list of supported file types */
const SUPPORTED_FILE_TYPE = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(x => `.${x}`).join(",");

/* generate an array of column objects */
const makeFieldsArray = dataFields => {
	let fieldsArray = [];
	for(var i = 0; i < dataFields.length; ++i){
        fieldsArray[i] = {name:dataFields[i], key:i}
    } 
	return fieldsArray;
};