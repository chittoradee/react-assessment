import ListItems from './List';
import Chart from './Chart';
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Chart />
          <br />
          <ListItems />
        </div>
      </div>
    </div>
  );
}
export default App;
