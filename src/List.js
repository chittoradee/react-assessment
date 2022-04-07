import { useEffect, useState } from "react";

import { Button } from "react-bootstrap";

const ListItems = () => {
	const [usersList, setUsersList] = useState([]);
	const [filteredData, setFilteredData] = useState(usersList);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortConfig, setSortConfig] = useState(null);
	const [q, setQ] = useState([]);

	const getUsers = async (currentPage) => {
		await fetch(
			`https://randomuser.me/api/?results=20&inc=location,name,picture,registered,phone&page=${currentPage}`,
			{
				dataType: "json",
			}
		)
			.then((response) => response.json())
			.then((data) => {
				let userData = [];
				data.results.map((result) =>
					userData.push({
						name: result.name.first + " " + result.name.last,
						location: result.location.city + " " + result.location.country,
						registered: result.registered.date,
						thumbnail: result.picture.thumbnail,
						phone: result.phone,
					})
				);
				setUsersList(userData);
				setFilteredData(userData);
				setCurrentPage(currentPage);
			});
	};
	const getRecords = (value) => {
		if (value === "prev") {
			setCurrentPage(currentPage - 1);
		} else {
			setCurrentPage(currentPage + 1);
		}
	};
	const requestSort = (key) => {
		let direction = "ascending";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "ascending"
		) {
			direction = "descending";
		}
		setSortConfig({ key, direction });
		let sortableItems = [...usersList];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
			setUsersList(sortableItems);
			setFilteredData(sortableItems);
		}
	};
    
	useEffect(() => {
		getUsers(currentPage);
	}, [currentPage]);
	const handleSearch = (key, event) => {
		var value = event.toLowerCase();
		setQ({ key: event });
		let result = [];
		result = usersList.filter((data) => {
			return data[key].toLowerCase().search(value) !== -1;
		});
		setFilteredData(result);
	};
	const deleteData = (index) => {
		if(window.confirm("Are you sure you want to delete this record?")) {
			const arr = [...filteredData];
			arr.splice(index, 1);
			setFilteredData(arr);
		}
	};
	return (
		<>
			
			<table className="table table-responsive" >
				<thead>
					<tr>
						<th style={{cursor:'pointer'}} onClick={() => requestSort("name")}>
							Name <br />
							<input
								tpye="text"
								value={q.name}
								onChange={(e) => handleSearch("name", e.target.value)}
							/>
						</th>
						<th style={{cursor:'pointer'}} onClick={() => requestSort("location")}>
							Location <br />
							<input
								tpye="text"
								value={q.location}
								onChange={(e) => handleSearch("location", e.target.value)}
							/>
						</th>
						<th style={{cursor:'pointer'}} onClick={() => requestSort("registered")}>
							Registered <br />
							<input
								tpye="text"
								value={q.registered}
								onChange={(e) => handleSearch("registered", e.target.value)}
							/>
						</th>
						<th>
							Phone <br />
							<input
								tpye="text"
								value={q.phone}
								onChange={(e) => handleSearch("phone", e.target.value)}
							/>
						</th>
						<th>Picture</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredData.length > 0 && filteredData.map((user, index) => (
						<tr key={index}>
							<td>
								{`${user.name}`}
							</td>
							<td>{`${user.location}`}</td>
							<td>{user.registered}</td>
							<td>{user.phone}</td>
							<td>
								<img src={user.thumbnail} alt="" />
							</td>
							<td>
								<Button onClick={() => deleteData(index)}>Delete</Button>
							</td>
						</tr>
					))}
					{filteredData.length === 0 && 
						<tr>
							<td colspan="6" className="text-center"><h2>No Record Found.</h2></td>
						</tr>
					}
				</tbody>
			</table>
			<div className="row">
			<div className="col-md-12 text-center">
				<Button
					className={currentPage === 1 && " disabled"}
					onClick={() => getRecords("prev")}
				>
					Prev
				</Button>
				&nbsp;
				<Button onClick={() => getRecords("next")}>Next</Button>
			</div>
			</div>
		</>
	);
};
export default ListItems;
