---
title: "How to manage secrets when working with an Azure Dev Space | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: ghogen
ms.author: ghogen
ms.date: "05/11/2018"
ms.topic: "article"
ms.technology: "azds-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: douge
---
# How to manage secrets when working with an Azure Dev Space

Your services might require certain passwords, connection strings, and other secrets, such as for databases or other secure Azure services. By setting the values of these secrets in configuration files, you can make them available in your code as environment variables.  These must be handled with care to avoid compromising the security of the secrets.

Azure Dev Spaces provides two recommended options for storing secrets: in the values.dev.yaml file, and inline directly in azds.yaml. It's not recommended to store secrets in values.yaml.
 
## Method 1: values.dev.yaml
1. Open VS Code with your project that is enabled for Azure Dev Spaces.
2. Add a file named _values.dev.yaml_ in the same folder as existing _values.yaml_ and define your secret key and values, as in the following example:

    ```yaml
    secrets:
      redis:
        port: "6380"
        host: "contosodevredis.redis.cache.windows.net"
        key: "secretkeyhere"
    ```
     
3. Update _azds.yaml_ to tell Azure Dev Spaces to use your new _values.dev.yaml_ file. To do this, add this configuration under the configurations.develop.container section:

    ```yaml
           container:
             values:
             - "charts/webfrontend/values.dev.yaml"
    ```
 
4. Modify your service code to refer to these secrets as environment variables, as in the following example:

    ```
    var redisPort = process.env.REDIS_PORT
    var host = process.env.REDIS_HOST
    var theKey = process.env.REDIS_KEY
    ```
    
5. Update the services running in your cluster with these changes. On the command line, run the command:

    ```
    azds up
    ```
 
6. (Optional) From the command line, check that these secrets have been created:

      ```
      kubectl get secret --namespace default -o yaml 
      ```

7. Make sure that you add _values.dev.yaml_ to the _.gitignore_ file to avoid committing secrets in source control.
 
 
## Method 2: Inline directly in azds.yaml
1.	In _azds.yaml_, set secrets under the yaml section configurations/develop/install. Although you can enter secret values directly there, it's not recommended because _azds.yaml_ is checked into source control. Instead, add placeholders using the "$PLACEHOLDER" syntax.

    ```yaml
    configurations:
      develop:
        ...
        install:
          set:
            secrets:
              redis:
                port: "$REDIS_PORT_DEV"
                host: "$REDIS_HOST_DEV"
                key: "$REDIS_KEY_DEV"
    ```
     
2.	Create a _.env_ file in the same folder as _azds.yaml_. Enter secrets using standard key=value notation. Don’t commit the _.env_ file to source control. (To omit from source control in git-based version control systems, add it to the _.gitignore_ file.) The following example shows an _.env_ file:

    ```
    REDIS_PORT_DEV=3333
    REDIS_HOST_DEV=myredishost
    REDIS_KEY_DEV=myrediskey
    ```
2.	Modify your service source code to reference these secrets in code, as in the following example:

    ```
    var redisPort = process.env.REDIS_PORT
    var host = process.env.REDIS_HOST
    var theKey = process.env.REDIS_KEY
    ```
 
3.	Update the services running in your cluster with these changes. On the command line, run the command:

    ```
    azds up
    ```

4.	(optional) View secrets from kubectl:

    ```
    kubectl get secret --namespace default -o yaml
    ```

## Next steps

With these methods, you can now securely connect to a database, a Redis cache, or access secure Azure services.
 