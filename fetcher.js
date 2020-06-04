const request = require('request');
const fs = require('fs');
const readline = require('readline');

const getArguments = () => {
  const arg = process.argv.slice(2);
  if (arg.length === 0) {
    console.log('Please provide webpage URL to download');
    process.exit(1);
  } else {
    return arg;
  }
};

const [URL, destination] = getArguments();

if (!destination) {
  console.log('Pathname invalid.');
  process.exit();
}

const processFile = (destination, body) => {
  fs.writeFile(destination, body, function (err) {
    if (err) return console.log(err);
    console.log('File Successfully fetched.');
  });
  rl.close();
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(URL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    if (fs.existsSync(destination)) {
      askToOverWrite(destination, body);
    } else {
      processFile(destination, body);
    }
  } else {
    console.log('error:', error);
    console.log('Request failed with ' + response.statusCode);
  }
});

const askToOverWrite = (destination, body) => {
  rl.question(
    'File already exists would you like to overwrite?(y/n)',
    (answer) => {
      if (answer === 'y') {
        console.log('ok overwriting file');
        processFile(destination, body);
      } else if (answer === 'n') {
        console.log('Exiting program');
        process.exit();
      } else {
        askToOverWrite();
      }
    }
  );
};
