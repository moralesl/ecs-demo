login:
	aws ecr get-login-password \
    	--region eu-central-1 \
		| docker login \
    		--username AWS \
    		--password-stdin 420927334919.dkr.ecr.eu-central-1.amazonaws.com

build:
	docker build -t sample-express-app .

describe-repositories:
	aws ecr describe-repositories
