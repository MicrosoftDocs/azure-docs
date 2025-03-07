```
Message: The resource {resource Id} extended location {custom location resource Id} does not support the resource type {IoT Operations resource type} or api version {IoT Operations ARM API}. Please check with the owner of the extended location to ensure the host has the CRD {custom resource name} with group {api group name}.iotoperations.azure.com, plural {custom resource plural name}, and versions [{api group version}] installed.
```

This error happens when the custom location resource associated with the deployment isn't properly configured with the API version(s) of resources attempting to be projected to the cluster. To resolve, delete any provisioned resources associated with prior deployment(s) including custom locations. 

You can use `az iot ops delete` or alternative mechanism. Due to a potential caching issue, waiting a few minutes after deletion before re-deploying AIO or choosing a custom location name via `az iot ops create --custom-location` is recommended.