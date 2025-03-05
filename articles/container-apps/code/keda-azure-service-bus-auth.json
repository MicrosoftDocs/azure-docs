apiVersion: v1
kind: Secret
metadata:
  name: my-secrets
  namespace: my-project
type: Opaque
data:
  connection-string-secret: <SERVICE_BUS_CONNECTION_STRING>
---
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata:
  name: azure-servicebus-auth
spec:
  secretTargetRef:
  - parameter: connection
    name: my-secrets
    key: connection-string-secret
---
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: azure-servicebus-queue-rule
  namespace: default
spec:
  scaleTargetRef:
    name: my-scale-target
  triggers:
  - type: azure-servicebus
    metadata:
      queueName: my-queue
      namespace: service-bus-namespace
      messageCount: "5"
    authenticationRef:
        name: azure-servicebus-auth