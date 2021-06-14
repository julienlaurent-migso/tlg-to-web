export const specGrid = [

                    <div className="list-group" key="specGrid">
                        <div className="list-group-item list-group-item-action bg-light ">
                            <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">1) Convert Props data to the good grid format and pass it to the html table</h5>
                            <small>In progress</small>
                            </div>
                            <p className="mb-1">see props in the console : this.props.importedData</p>
                            <p className="mb-1">Create Backend function to manage importedData</p>
                            <p className="mb-1">to be store inside the component state : this.state.grid</p>
                            <p className="mb-1">Pass all data into html table</p>
                            <p className="mb-1">Use bootstrap table format (bootstrap is already called from script tag inside index.html)</p>
                            <span className="badge bg-warning text-dark">Specificities</span>
                            <p className="mb-1">all keys name have to be in calmel case format (ex: Project Key = projectKey) </p>
                            <p className="mb-1">Parse Lvl to an integer</p>
                            <p className="mb-1">Convert all date to Date class object</p>
                            <p className="mb-1">Keep only Baseline Start / Baseline Finish and create Start / Finish date</p>
                            <p className="mb-1">Start Date : if item planned = Planned Start / If not = Actual Start </p>
                            <p className="mb-1">Finish Date : if item planned = Planned Finish / If item in progress || in late = Panned Finish / If item completed = actual Finish </p>
                            <p className="mb-1">Keep Id / Parent Id type in string</p>
                            <p className="mb-1">Include a column at the first position to display the row number</p>
                            <small>In a second time, we will separate the big grid component into several small ones </small>
                        </div>
                        <div className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">2) Add customs renderer (editor,...) to manage cell specificities </h6>
                            <small>Backlog</small>
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">3) Add class to manage the rows & cells formatting</h6>
                            <small>Backlog</small>
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">4) Add UX columns to add and delete rows</h6>
                            <small>Backlog</small>
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">5) Add move up & down function to easly sort rows (could be drag & drop)</h6>
                            <small>Backlog</small>
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">...</h6>
                            <small>Backlog</small>
                            </div>
                        </div>
                    </div>
            
] 