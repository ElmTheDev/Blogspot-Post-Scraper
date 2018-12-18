// Blogspot Post Scraper made by Elmedin Turkes (@elmthedev)
// This version was written on 7th December of 2018

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Main configuration

let targetUrl = "example.blogspot.com";
let scrapedPosts = [];
let postsToScrap = 100;


class Post
{
	constructor(title, preview, date, link)
	{
		this.Title = title;
		this.Preview = preview;
		this.Date = date;
		this.Link = link;
	}
}


request(`http://${targetUrl}/search?max-results=${postsToScrap}`, function (error, response, body) 
{
	if(error) throw error;
	if(response.statusCode != 200) throw "Something went wrong scraping posts";
	
	let iTemp = 0;
	
	console.log(response.statusCode);
	let $ = cheerio.load(body);
	
	$('.post-title.entry-title').each(function(i, obj) {
		$(obj).children().each(function(i, obj)
		{
			let temporaryPost = new Post($(obj).text(), '', '', '', '');
			scrapedPosts.push(temporaryPost);
		});
	});
	
	iTemp = 0;
	$('.published').each(function(i, obj) {
		if(iTemp+1 == scrapedPosts.length) 
			return;
		
		scrapedPosts[iTemp].Date = $(obj).text().replace(/\n/g, "");
		iTemp++;
	});
	
	iTemp = 0;
	$('.post-snippet.snippet-container.r-snippet-container').each(function(i, obj) {
		if(iTemp+1 == scrapedPosts.length) 
			return;
		
		scrapedPosts[iTemp].Preview = $(obj).text();
		iTemp++;
	});
	
	iTemp = 0;
	$('.post-title.entry-title').each(function(i, obj) {
		if(iTemp+1 == scrapedPosts.length) 
			return;
		
		$(obj).children().each(function(i, obj)
		{
			scrapedPosts[iTemp].Link = $(obj).attr('href');
			iTemp++;
		});
	});
	
	MakeFiles();
});

function MakeFiles()
{
	for(i = 0; i < scrapedPosts.length; i++)
	{
		let title = scrapedPosts[i].Title; 
		let link = scrapedPosts[i].Link;
		let date = scrapedPosts[i].Date;
		let preview = scrapedPosts[i].Preview;
		
		
		fs.writeFile(`pages/${i+1}.txt`, `Title: ${title}\nDate: ${date}\nLink: ${link}\n\nPreview:\n\n ${preview}`, function(err) {
			if(err) throw err;
		}); 
	}
	
	console.log(`${scrapedPosts.length} posts were saved to /pages folder`);
}
