az containerapp create \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --image <CONTAINER_IMAGE_LOCATION>
  --min-replicas 0 \
  --max-replicas 5 \
  --secrets "connection-string-secret=<SERVICE_BUS_CONNECTION_STRING>" \
  --scale-rule-name azure-servicebus-queue-rule \
  --scale-rule-type azure-servicebus \
  --scale-rule-metadata "queueName=my-queue" \
                        "namespace=service-bus-namespace" \
                        "messageCount=5" \
  --scale-rule-auth "connection=connection-string-secret"