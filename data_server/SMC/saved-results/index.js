var fs = require('fs');
var async = require('async');

var startIndex = -1;
var endIndex = -1;
var androidFile = '';
var inputs = process.argv.forEach(function(val, index, array) {
	if(index == 2)
		startIndex = val;
	else if(index == 3)
		endIndex = val;
	else if(index == 4)
		androidFile = val;
});

var directories = [];
var androidTime = [];
var problems = [];

if(startIndex != -1 && endIndex != -1)
{
	for(var i = startIndex; i <= endIndex; i++)
	{
		for(var k = 0; k < 40; k++)
		{
			var dir = i + '-' + k;
			directories.push(dir);
                        directories.push(dir + '_1');
                        directories.push(dir + '_2');
		}
	}
}

fs.readFile(androidFile, 'utf8', function(err, data) {
	if (err)
	{
		return console.log(err)
	}
	var lines = data.split('\n');
	count = 0;
	androidTime = [];
	lines.forEach(function(val, index, array) {
		if(val[0] == '\t' && (index - 5) % 97 != 0)
		{
			var splitLine = val.split('\t').slice(1,val.length - 1)
			androidTime[count] = [];
			androidTime[count][0] = splitLine[1];
			androidTime[count][1] = splitLine[3];
			androidTime[count][2] = splitLine[5];
			androidTime[count][3] = splitLine[7];
			count++;
		}
	});

	async.map(directories, readTime, function(err, results) {
		for(var i = 0; i < results.length; i++)
		{
			results[i][3] = androidTime[parseInt(i/3)][0];
			results[i][4] = androidTime[parseInt(i/3)][1];
			results[i][5] = androidTime[parseInt(i/3)][2];
			results[i][6] = androidTime[parseInt(i/3)][3];
		}
		//console.log(results);
		createExcelFile(results);
	});
});

function readTime(dir, callback) {
	fs.readdir(dir, function (err, files) {
		files.forEach(function(file) {
			if(file.charAt(0).match(/[a-zA-Z]/i))
			{
				var arr = [];
				fs.readFile(dir + '/' + file, 'utf8', function(err, data) {
					if (err)
					{
						return console.log(err)
					}
					var lines = data.split("\n");
					var accuracy = parseInt(lines[10].split(' ')[2]) / 
								   parseInt(lines[11].split(' ')[2]);
                                        if(parseInt(lines[11].split(' ')[2]) != 64516)
					{
					    problems.push(dir);
					}
					var time = parseInt(lines[4].split(' ')[6]) + 
							   parseInt(lines[5].split(' ')[6]) + 
							   parseInt(lines[6].split(' ')[6]) + 
							   parseInt(lines[7].split(' ')[7]);
					arr[0] = dir;
					arr[1] = time; 
					arr[2] = accuracy;
					
					callback(null, arr);
				});
			}
		});
	});
}

function createExcelFile(results)
{
	var stream = fs.createWriteStream('Time.txt');
	stream.once('open', function(fd) {
		count = 0;
		while(count < results.length)
		{
			var val = parseInt(results[count][1]) + 
						 parseInt(results[count][3]) +
						 parseInt(results[count][4]) + 
						 parseInt(results[count][5]) +
						 parseInt(results[count][6]);
			if(count % (40*3) == 0 && count != 0)
				stream.write('\n');
			var acc = results[count][2];
			var count1 = count + 1;
			var count2 = count + 2;
			problems.forEach(function(problem){
				if(results[count][0] == problem || 
				   results[count1][0] == problem ||
				   results[count2][0] == problem)
				{
					console.log(problem);
					console.log(acc);
					console.log(results[count1][2]);
					console.log(results[count2][2]);
				}
			});
			if(acc != results[count1][2] && acc != results[count2][2])
			{
				console.log('1 error');
				if(results[count1][2] == results[count2][2])
					acc = results[count1][2];
				else
					acc = 'ERROR';
			}
			stream.write(acc + '\t' + 
				     results[count][1] + '\t' + 
				     results[count][3] + '\t' + 
				     results[count][4] + '\t' + 
				     results[count][5] + '\t' + 
				     results[count][6] + '\t' + 
				     val + '\t');
			count = count + 3;
		}
		stream.end();
	});
}
