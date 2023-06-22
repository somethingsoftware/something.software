const express = require('express');
const app = express();
const fs = require('fs');
const request = require("request");
const BASE_URL = "https://something.software/";
var sitemap = ["robots.txt","favicon.png","assets/css/main.css",""];

app.get('/favicon.png', (req, res, next) => {
	res.sendFile('./favicon.png', { root: __dirname });
});

app.get('/', (req, res, next) => {
	res.sendFile('./main.html', { root: __dirname });
});

app.get('/assets/css/main.css', (req, res, next) => {
	res.sendFile('./assets/css/main.css', { root: __dirname });
});

app.get("/robots.txt", (req, res, next) => {
	res.send(`User-agent: *\nAllow: /\nSitemap: ${BASE_URL}sitemap.xml`);
	res.status(200);
	res.end();
});

function genSiteMap(){
	const lastmod = new Date(Date.now()).toISOString().split("T")[0];
	let response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
	sitemap.forEach(function (URLs){
		response+="<url>\n<loc>"+ BASE_URL + URLs + "</loc>\n";
		response+="<lastmod>" + lastmod + "</lastmod>\n</url>\n"
	});
	response+="</urlset>"
	app.get("/sitemap.xml", (req, res, next) => {
		res.send(response);
		res.status(200);
		res.end();
	});
}

genSiteMap();

app.use(function(req, res, next) {
	res.status(404).sendFile('./main.html', { root: __dirname },);

});

app.listen(8080);
request.get(`http://www.google.com/ping?sitemap=${BASE_URL}sitemap.xml`);
request.get(`http://www.bing.com/ping?sitemap=${BASE_URL}sitemap.xml`);