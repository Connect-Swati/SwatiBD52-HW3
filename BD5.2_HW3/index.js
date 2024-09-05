//npm install express sequelize sqlite3
let express = require("express");
let app = express();
let port = 3000;

let Company = require("./models/company.model");

let { sequelize_instance } = require("./lib/index");

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: " BD5.2 - HW3" });
});

let companaiesData = [
  {
    id: 1,
    name: "Tech Innovators",
    industry: "Technology",
    foundedYear: 2010,
    headquarters: "San Francisco",
    revenue: 75000000,
  },
  {
    id: 2,
    name: "Green Earth",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Portland",
    revenue: 50000000,
  },
  {
    id: 3,
    name: "Innovatech",
    industry: "Technology",
    foundedYear: 2012,
    headquarters: "Los Angeles",
    revenue: 65000000,
  },
  {
    id: 4,
    name: "Solar Solutions",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Austin",
    revenue: 60000000,
  },
  {
    id: 5,
    name: "HealthFirst",
    industry: "Healthcare",
    foundedYear: 2008,
    headquarters: "New York",
    revenue: 80000000,
  },
  {
    id: 6,
    name: "EcoPower",
    industry: "Renewable Energy",
    foundedYear: 2018,
    headquarters: "Seattle",
    revenue: 55000000,
  },
  {
    id: 7,
    name: "MediCare",
    industry: "Healthcare",
    foundedYear: 2012,
    headquarters: "Boston",
    revenue: 70000000,
  },
  {
    id: 8,
    name: "NextGen Tech",
    industry: "Technology",
    foundedYear: 2018,
    headquarters: "Chicago",
    revenue: 72000000,
  },
  {
    id: 9,
    name: "LifeWell",
    industry: "Healthcare",
    foundedYear: 2010,
    headquarters: "Houston",
    revenue: 75000000,
  },
  {
    id: 10,
    name: "CleanTech",
    industry: "Renewable Energy",
    foundedYear: 2008,
    headquarters: "Denver",
    revenue: 62000000,
  },
];

// endpoint to seed the database
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize_instance.sync({ force: true });
    await Company.bulkCreate(companaiesData);
    return res.status(200).json({
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.log("Error in seeding database", error.message);
    return res.status(500).json({
      code: 500,
      message: "Eroor in seeding database",
      error: error.message,
    });
  }
});

/*
Exercise 1: Fetch all companies

Create an endpoint /companies that’ll return all the employees in the database.

Create a function named fetchAllCompanies to query the database using the sequelize instance.

API Call

http://localhost:3000/companies

Expected Output:

{
  'companies' : [
    // All the companies  in the database
  ],
}

*/
// fucntion to fetch all companies
async function fetchAllCompanies() {
  try {
    let companies = await Company.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!companies || companies.length == 0) {
      throw new Error("No companies found");
    }
    return { companies: companies };
  } catch (error) {
    console.log("error in fetching all companies", error.message);
    throw error;
  }
}
// endpoint to fetch all companies
app.get("/companies", async (req, res) => {
  try {
    let companies = await fetchAllCompanies();
    console.log("succesfully fetched all companies");
    return res.status(200).json(companies);
  } catch (error) {
    if (error.message == "No companies found") {
      return res.status(404).json({
        code: 404,
        message: "No companies found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching all companies",
        error: error.message,
      });
    }
  }
});

/*
Exercise 2: Fetch companies details by ID

Create an endpoint /companies/details/:id that’ll return companies details based on the ID.

Declare a variable named id to store the path parameter passed by the user.

Create a function named fetchCompaniesById to query the database using the sequelize instance.

API Call

http://localhost:3000/companies/details/2

Expected Output:

{
  'company': {
    'id': 2,
    'name': 'Green Earth',
    'industry': 'Renewable Energy',
    'foundedYear': 2015,
    'headquarters': 'Portland',
    'revenue': 50000000
  }
}


*/
// function to fetch companies details by id
async function fetchCompaniesById(id) {
  try {
    let company = await Company.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!company) {
      throw new Error("No company found");
    }
    return { company: company };
  } catch (error) {
    console.log("error in fetching companies details by id", error.message);
    throw error;
  }
}
// endpoint to fetch companies details by id
app.get("/companies/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let company = await fetchCompaniesById(id);
    console.log("succesfully fetched companies details by id = " + id);
    return res.status(200).json(company);
  } catch (error) {
    if (error.message == "No company found") {
      return res.status(404).json({
        code: 404,
        message: "No company found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching companies details by id",
        error: error.message,
      });
    }
  }
});
/*
Exercise 3: Fetch all companies by industry

Create an endpoint /companies/industry/:industrythat’ll return all the companies in a industry.

Declare a variable named industryto store the path parameter passed by the user.

Create a function named fetchEmployeesByIndustryto to query the database using the sequelize instance.

API Call

http://localhost:3000/companies/industry/Technology

Expected Output:

{
  'companies' : [
		   {
		    'id': 1,
		    'name': 'Tech Innovators',
		    'industry': 'Technology',
		    'foundedYear': 2010,
		    'headquarters': 'San Francisco',
		    'revenue': 75000000
		  },
		  {
		    'id': 3,
		    'name': 'Innovatech',
		    'industry': 'Technology',
		    'foundedYear': 2012,
		    'headquarters': 'Los Angeles',
		    'revenue': 65000000
		  },
		  {
		    'id': 8,
		    'name': 'NextGen Tech',
		    'industry': 'Technology',
		    'foundedYear': 2018,
		    'headquarters': 'Chicago',
		    'revenue': 72000000
		  }
  ]
}
*/
// function to fetch all companies by industry
async function fetchCompaniesByIndustry(industry) {
  try {
    let companies = await Company.findAll({
      where: {
        industry: industry,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!companies || companies.length == 0) {
      throw new Error("No companies found");
    }
    return { companies: companies };
  } catch (error) {
    console.log("error in fetching all companies by industry", error.message);
    throw error;
  }
}
// endpoint to fetch all companies by industry
app.get("/companies/industry/:industry", async (req, res) => {
  try {
    let industry = req.params.industry;
    let companies = await fetchCompaniesByIndustry(industry);
    console.log("succesfully fetched all companies by industry = " + industry);
    return res.status(200).json(companies);
  } catch (error) {
    if (error.message == "No companies found") {
      return res.status(404).json({
        code: 404,
        message: "No companies found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching all companies by industry",
        error: error.message,
      });
    }
  }
});

/*
Exercise 4: Sort all the companies by their revenue

Create an endpoint /companies/revenue that’ll return all the companies sorted by their revenue.

Declare a variable named order to store the query parameter passed by the user.

order can only hold asc OR desc.

Create a function named sortCompaniesByRevenue to query the database using the sequelize instance.

API Call

http://localhost:3000/companies/revenue?order=asc

Expected Output:

{
  'companies' :[
		  {
		    'id': 2,
		    'name': 'Green Earth',
		    'industry': 'Renewable Energy',
		    'foundedYear': 2015,
		    'headquarters': 'Portland',
		    'revenue': 50000000
		  },
		  {
		    'id': 6,
		    'name': 'EcoPower',
		    'industry': 'Renewable Energy',
		    'foundedYear': 2018,
		    'headquarters': 'Seattle',
		    'revenue': 55000000
		  },
		  {
		    'id': 4,
		    'name': 'Solar Solutions',
		    'industry': 'Renewable Energy',
		    'foundedYear': 2015,
		    'headquarters': 'Austin',
		    'revenue': 60000000
		  },
		  {
		    'id': 10,
		    'name': 'CleanTech',
		    'industry': 'Renewable Energy',
		    'foundedYear': 2008,
		    'headquarters': 'Denver',
		    'revenue': 62000000
		  },
		  {
		    'id': 3,
		    'name': 'Innovatech',
		    'industry': 'Technology',
		    'foundedYear': 2012,
		    'headquarters': 'Los Angeles',
		    'revenue': 65000000
		  },
		  {
		    'id': 7,
		    'name': 'MediCare',
		    'industry': 'Healthcare',
		    'foundedYear': 2012,
		    'headquarters': 'Boston',
		    'revenue': 70000000
		  },
		  {
		    'id': 8,
		    'name': 'NextGen Tech',
		    'industry': 'Technology',
		    'foundedYear': 2018,
		    'headquarters': 'Chicago',
		    'revenue': 72000000
		  },
		  {
		    'id': 1,
		    'name': 'Tech Innovators',
		    'industry': 'Technology',
		    'foundedYear': 2010,
		    'headquarters': 'San Francisco',
		    'revenue': 75000000
		  },
		  {
		    'id': 9,
		    'name': 'LifeWell',
		    'industry': 'Healthcare',
		    'foundedYear': 2010,
		    'headquarters': 'Houston',
		    'revenue': 75000000
		  },
		  {
		    'id': 5,
		    'name': 'HealthFirst',
		    'industry': 'Healthcare',
		    'foundedYear': 2008,
		    'headquarters': 'New York',
		    'revenue': 80000000
		  }
	]

}
*/
// function to sort all the companies by their revenue
async function sortCompaniesByRevenue(order) {
  try {
    let companies = await Company.findAll({
      order: [["revenue", order]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!companies || companies.length == 0) {
      throw new Error("No companies found");
    }
    return { companies: companies };
  } catch (error) {
    console.log(
      "error in sorting all the companies by their revenue",
      error.message,
    );
    throw error;
  }
}
// endpoint to sort all the companies by their revenue
app.get("/companies/revenue", async (req, res) => {
  try {
    let order = req.query.order;
    let companies = await sortCompaniesByRevenue(order);
    console.log("succesfully sorted all the companies by their revenue");
    return res.status(200).json(companies);
  } catch (error) {
    if (error.message == "No companies found") {
      return res.status(404).json({
        code: 404,
        message: "No companies found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in sorting all the companies by their revenue",
        error: error.message,
      });
    }
  }
});
