docker build . -t inspirewall
docker tag inspirewall gcr.io/flanders-raw-production/inspirewall:1
gcloud auth activate-service-account --key-file=./config/google.json
gcloud config set project flanders-raw-production
gcloud auth configure-docker
docker push gcr.io/flanders-raw-production/inspirewall:1
gcloud run deploy --image=gcr.io/flanders-raw-production/inspirewall:1 --platform=managed --region=europe-west1 --allow-unauthenticated

        