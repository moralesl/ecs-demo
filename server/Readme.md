## Getting started with the Docker container

The webserver consists of a `Dockerfile` that specifies how the container is build and the `server.js`.

### Running locally

To run the `server.js` locally, simply run `node server.js` and you have installed all necessary dependencies (`npm install`).
Than you can simply visit [http://localhost:8080/](http://localhost:8080/).

### Build container

To build the container, you can run `docker build -t sample-express-app .` to build locally. It will have the image identifier `sample-express-app`.

### Push container

To push the container to your ECR registry, you first have to login to the ECR registry, see [get-login-password](https://docs.aws.amazon.com/cli/latest/reference/ecr/get-login-password.html) for more details.

Than you can tag the image
```
docker tag sample-express-app:v1 <aws_account_id>.dkr.ecr.eu-central-1.amazonaws.com/<image-repository-identifier>
```

and push it:

```
docker push <aws_account_id>.dkr.ecr.eu-central-1.amazonaws.com/<image-repository-identifier>:v1
```
