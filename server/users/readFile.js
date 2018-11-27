var fs = require('fs');
fs.readFile('./defaultProfileImg', (err, data) => {
  if (err) throw err;
  console.log(data);
});
