import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "ASIAUVTUUBT47BQFSF43",
  secretAccessKey: "lsnxazQug/HHJQ7mvU+tJpImBcB+AJ/tIBxMghqH", 
  sessionToken: "IQoJb3JpZ2luX2VjEKn//////////wEaCXVzLXdlc3QtMiJGMEQCIAzGQhPQDy4dTzwW2oLSdIM38Kn8Bzj6ve09bu0aVmnTAiBu4DEYtns5GzjixlX/BYFG9Q2nVN9wMxMGleBEArQEJyqwAggyEAAaDDMyMTI5MzM4OTA0OSIMrpMc8zBD5L+0gKKLKo0C0X32J2GHTwhvvbyhO9OpFfa+FpttrRYJs8hBCG675cJuEiqu+B686sDajfgkFhiZjeK204WqcnmRh2GfdenwjZ+3LMEe34Knd8KHReIK6cFVzFy41KMwK8BNiqWueo8OBQElWnb+rKddUeNEeh3q5/JQp2dlkM8ZHUoaJZ/LFK5rT/NuRH/EJUAAypmrf+4NCKJppu3vGUCzZmQ+zwu8XHiVn8DkLmGU+H2NHeL1bCrzMGVUfiM3nl76qdLJNh8G8OocvcnGv0pEI9qZPsaS1kTuxJ+PIANc/sJm95frtiu5d0Mt0gIqhjXpgqiX3whwUaDiOfYcop1O42Jg75/jsZa+D5cDI37AwtNTEXQwypX6vwY6ngH5CxrleEL5C0Ds8a5f982Cml2H9HttWKb83+ozj8dAfoTu3/a2MlI/REB3I7pPSyWMZDKF537jERAS0ch+b6jXEdOiuvqV5JHfyBenEOFD1aJdLLl7JTWxNVt5FBcp+fhYXDa8YkGpd3Nhi6ms4clrhGL9b+31jyf35Qjsy8ptGR1NIAivuek8qJar8bfJEBA5//ryRknll+AsijqTGQ==",
  region: "us-east-1",
});

const s3 = new AWS.S3();

export default s3;
