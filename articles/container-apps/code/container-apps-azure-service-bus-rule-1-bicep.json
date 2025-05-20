resource symbolicname 'Microsoft.App/containerApps@2025-02-02-preview' = {
  ...
  properties: {
    ...
    configuration: {
      ...
      secrets: [
        {
          name: 'connection-string-secret'
          value: '<SERVICE_BUS_CONNECTION_STRING>'
        }
      ]
    }
    template: {
      ...
      scale: {
        maxReplicas: 0
        minReplicas: 5
        rules: [
          {
            name: 'azure-servicebus-queue-rule'
            custom: {
              type: 'azure-servicebus'
              metadata: {
                queueName: 'my-queue'
                namespace: 'service-bus-namespace'
                messageCount: '5'
              }
              auth: [
                {
                  secretRef: 'connection-string-secret'
                  triggerParameter: 'connection'
                }
              ]
            }
          }
        ]
      }
    }
  }
}
