# Troubleshooting Custom Container in Azure Spring Cloud



## I encountered a problem with creating a custom container application 

1. Please ensure your "server" and  "containerImage" are provided correctly. The valid examples are:  

 ```json
// Docker hub example
{
    "server": "docker.io",
    "containerImage": "myRepo/myImage:myTag"
}
// Azure Container Registry example
{
    "server": "myregistry.azurecr.io",
    "containerImage": "myImage:myTag"
}
 ```

2. In current stage of Custom Container feature, please ensure your application will listen to port 1025. This port will be used for all the ingress traffic including health check. 



### Common errors

| Error Message                                | How to fix                                                   |
| -------------------------------------------- | ------------------------------------------------------------ |
| Failed to pull image from docker registry    | Please ensure your "Server" and "ContainerImage" are provided correctly following the above example.  Please also ensure and verify The "ImageRegistryCredential" provided is valid and have enough access to pull the image. |
| Failed to create custom container deployment | Please first check the log of the application to make sure it is not crashed by unexpected code logic or bug. Besides that, please also ensure your application listens to port 1025. If  "Command" or "Args" property is provided, please also make sure they are valid. |

