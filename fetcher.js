const request = require('request');
const fs = require('fs');
const readline = require('readline');

/**
 * Downloads a specified URL to a specified local path.
 * @param {string} url the website resource you want to download.
 * @param {string} path the local file path where you want to save the resource.
 */
const fetchWebPage = function (url, path) {
  // if file already exists, ask the user if they want to overwrite it.
  fs.access(path, err => {
    // if file exists (ie no error thrown by fs.access), ask if user wants to overwrite it
    if (!err) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question(
        'This file already exists. Do you want to overwrite it? (type \'y\' to overwrite)',
        answer => {
          if (answer !== 'y') {
            console.log('Exiting app');
            process.exit();
          }
          rl.close();
          requestingAndWriting(url, path);
        }
      );
      // if the file DOESN'T exist, go ahead with the request
    } else {
      requestingAndWriting(url, path);
    }
  });
};

/**
 * 
 * @param {string} url 
 * @param {string} path 
 */
const requestingAndWriting = (url, path) => {
  request(
    `http://${url}`,
    (error, response, body) => {
      // if bad URL, exit the program without writing the file.
      if (error) {
        console.log('An error occurred when requesting the URL. Exiting program.');
        process.exit();
        // if response statusCode is not 200, exit the program wtihout writing the file.
      } else if (response && response.statusCode !== 200) {
        console.log(`Status code is ${response.statusCode}. ${url} will NOT be written to ${path}.`);
        process.exit();
      }
      // If everything goes well, write the file to path
      fs.writeFile(
        path,
        body,
        (error) => {
          if (error) {
            console.log(`It didn't work! Here is the error message: ${error}`);
            process.exit();
          }
          console.log(`Downloaded and saved ${response.headers["content-length"]} bytes to ${path}`);
        }
      );
    }
  );
};

module.exports = { fetchWebPage };

// DRIVER CODE
fetchWebPage(process.argv[2], process.argv[3]);