---
author: KarlErickson
ms.author: yili7
ms.service: spring-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 08/03/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps enterprise plan.

[!INCLUDE [deploy-to-azure-spring-apps-enterprise-plan](includes/quickstart-deploy-java-native-image-app/deploy-enterprise-plan.md
)]

-->

## 2. Prepare the Spring Petclinic project

Use the following steps to clone and run the app locally.

1. Use the following command to clone the Spring Petclinic project from GitHub:

   ```bash
   git clone https://github.com/spring-projects/spring-petclinic.git
   ```

2. Use the following command to build the Spring Petclinic project:

   ```bash
   cd spring-petclinic
   ./mvnw clean package -DskipTests -Pnative package
   ```

3. Use the following command to run the Spring Petclinic application by using Maven:

   ```bash
   java -jar target/spring-petclinic-3.1.0-SNAPSHOT.jar
   ```

4. Go to `http://localhost:8080` in your browser to access the Spring Petclinic application.

## 3. Prepare the cloud environment

The main resource required to run Spring Petclinic application is an Azure Spring Apps instance. This section provides the steps to create the resource.

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export RESOURCE_GROUP=<resource-group-name>
export LOCATION=<location>
export AZURE_SPRING_APPS_NAME=<Azure-Spring-Apps-service-instance-name>
export NATIVE_BUILDER=native-builder
export JAR_APP_NAME=jar-app
export NATIVE_APP_NAME=native-app
export JAR_PATH=target/spring-petclinic-3.1.0-SNAPSHOT.jar
```

### 3.2. Create a new resource group

Use the following steps to create a new resource group.

1. Use the following command to sign in to the Azure CLI.

   ```azurecli
   az login
   ```

1. Use the following command to set the default location.

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions to determine the subscription ID to use.

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set the default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group.

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group.

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3.3. Create an Azure Spring Apps instance

Azure Spring Apps is used to host the Spring Petclinic app. Create an Azure Spring Apps instance and two applications inside it.

1. Use the following command to create an Azure Spring Apps service instance, configure build pool size to S7 as native image build requires 16Gi memory during image build.

   ```azurecli
   az spring create --name ${AZURE_SPRING_APPS_NAME} --sku enterprise \
       --build-pool-size S7    
   ```

1. Create a file builder-native.json with the content below in the current directory:
   
   ```json
   {
      "stack": {
        "id": "io.buildpacks.stacks.jammy",
        "version": "tiny"
      },
      "buildpackGroups": [
        {
          "name": "default",
          "buildpacks": [
            {
              "id": "tanzu-buildpacks/java-native-image"
            }
          ]
        }
      ]
    }  
   ```
   
1. Use the following command to create an custom builder to build Native Image application.
   
   ```azurecli
   az spring build-service builder create -n ${NATIVE_BUILDER} \
       --builder-file builder-native.json    
   ```
   
1. Use the following command to create an application in the Azure Spring Apps instance to deploy Spring Petclinic application as jar, confgure memory limit to `1Gi`.

   ```azurecli
   az spring app create \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${JAR_APP_NAME} \
       --cpu 1 \
       --memory 1Gi \
       --assign-endpoint true
   ```
   
1. Use the following command to create an application in the Azure Spring Apps instance to deploy Spring Petclinic application as Native Image.

   ```azurecli
   az spring app create \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${NATIVE_APP_NAME} \
       --cpu 1 \
       --memory 1Gi \
       --assign-endpoint true
   ```

## 4. Deploy the app to Azure Spring Apps

Now that the cloud environment is prepared, the applications are ready to deploy. 

Use the following command to deploy Spring Petclinic application as jar:

```azurecli
az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${JAR_APP_NAME} \
    --artifact-path ${JAR_PATH} \
    --build-env BP_JVM_VERSION=17
```

Use the following command to deploy Spring Petclinic application as Native Image:

```azurecli
az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${NATIVE_APP_NAME} \
    --builder ${NATIVE_BUILDER} \
    --build-cpu 8 \
    --build-memory 16Gi \
    --artifact-path ${JAR_PATH} \
    --build-env BP_JVM_VERSION=17 BP_NATIVE_IMAGE=true
```
