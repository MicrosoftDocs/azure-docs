---
title: Integrate existing MongoDB application with Azure Cosmos DB API for MongoDB and Open Service Broker for Azure (OSBA)
description: In this article, you learn how to integrate an existing Java and MongoDB application with the Azure Cosmos DB API for MongoDB using Open Service Broker for Azure (OSBA).
services: azure-dev-spaces
author: zr-msft
manager: jeconnoc
ms.service: azure-dev-spaces
ms.topic: article
ms.date: 01/25/2019
ms.author: zarhoads
ms.custom: mvc
keywords: "Cosmos DB, Open Service Broker, Open Service Broker for Azure"

#Customer intent: As a developer, I want to learn how to integrate an existing MongoDB app with cosmos db via osba.
---

# Integrate existing MongoDB application with Azure Cosmos DB API for MongoDB and Open Service Broker for Azure (OSBA)

Azure Cosmos DB is a globally distributed, multi-model database service. It also provides wire protocol compatibility with several NoSQL APIs including for MongoDB. The Cosmos DB API for MongoDB allows you to use Cosmos DB with your existing MongoDB application without having to change your application's database drivers or implementation. You can also provision a Cosmos DB service using Open Service Broker for Azure.

In this article, you take an existing Java application that uses a MongoDB database and update it to use a Cosmos DB database using Open Service Broker for Azure.

## Prerequisites

Before you can proceed, you must:
	
* Have an [Azure Kubernetes Service cluster](kubernetes-walkthrough.md) created.
* Have [Open Service Broker for Azure installed and configured on your AKS cluster](integrate-azure.md). 
* Have the [Service Catalog CLI](https://svc-cat.io/docs/install/) installed and configured to run `svcat` commands.
* Have an existing [MongoDB](https://www.mongodb.com/) database. For example, you could have MongoDB running on your [development machine](https://docs.mongodb.com/manual/administration/install-community/) or in an [Azure VM](../virtual-machines/linux/install-mongodb.md).
* Have a way of connecting to and querying the MongoDB database, such as the [mongo shell](https://docs.mongodb.com/manual/mongo/).

## Get application code
	
In this article, you use the [spring music sample application from Cloud Foundry](https://github.com/cloudfoundry-samples/spring-music) to demonstrate an application that uses a MongoDB database.
	
Clone the application from GitHub and navigate into its directory:
	
```cmd
git clone https://github.com/cloudfoundry-samples/spring-music
cd spring-music
```

## Prepare the application to use your MongoDB database

The spring music sample application provides many options for datasources. In this article, you configure it to use an existing MongoDB database. 

Add the YAML following to the end of *src/main/resources/application.yml*. This addition creates a profile called *mongodb* and configures a URI and database name. Replace the URI with the connection information to your existing MongoDB database. Adding the URI, which contains a username and password, directly to this file is for **development use only** and **should never be added to version control**.

```yaml
---
spring:
  profiles: mongodb
  data:
    mongodb:
      uri: "mongodb://user:password@serverAddress:port/musicdb"
      database: musicdb
```



When you start your application and tell it to use the *mongodb* profile, it connects to your MongoDB database and use it to store the application's data.

To build your application:

```cmd
./gradlew clean assemble

Starting a Gradle Daemon (subsequent builds will be faster)

BUILD SUCCESSFUL in 10s
4 actionable tasks: 4 executed
```

Start your application and tell it to use the *mongodb* profile:

```cmd
java -jar -Dspring.profiles.active=mongodb build/libs/spring-music-1.0.jar
```

Navigate to `http://localhost:8080` in your browser.

![Spring Music app with default data](media/music-app.png)

Notice the application has been populated with some [default data](https://github.com/cloudfoundry-samples/spring-music/blob/master/src/main/resources/albums.json). Interact with it by deleting a few existing albums and creating a few new ones.

You can verify your application is using your MongoDB database by connecting to it and querying the *musicdb* database:

```cmd
mongo serverAddress:port/musicdb -u user -p password
use musicdb
db.album.find()

{ "_id" : ObjectId("5c1bb6f5df0e66f13f9c446d"), "title" : "Nevermind", "artist" : "Nirvana", "releaseYear" : "1991", "genre" : "Rock", "trackCount" : 0, "_class" : "org.cloudfoundry.samples.music.domain.Album" }
{ "_id" : ObjectId("5c1bb6f5df0e66f13f9c446e"), "title" : "Pet Sounds", "artist" : "The Beach Boys", "releaseYear" : "1966", "genre" : "Rock", "trackCount" : 0, "_class" : "org.cloudfoundry.samples.music.domain.Album" }
{ "_id" : ObjectId("5c1bb6f5df0e66f13f9c446f"), "title" : "What's Going On", "artist" : "Marvin Gaye", "releaseYear" : "1971", "genre" : "Rock", "trackCount" : 0, "_class" : "org.cloudfoundry.samples.music.domain.Album" }
...
```

The preceding example uses the [mongo shell](https://docs.mongodb.com/manual/mongo/) to connect to the MongoDB database and query it. You can also verify your changes are persisted by stopping your application, restarting it, and navigating back to it in your browser. Notice the changes you have made are still there.


## Create a Cosmos DB database

To create a Cosmos DB database in Azure using Open Service Broker, use the `svcat provision` command:

```cmd
svcat provision musicdb --class azure-cosmosdb-mongo-account --plan account  --params-json '{
  "location": "eastus",
  "resourceGroup": "MyResourceGroup",
  "ipFilters" : {
    "allowedIPRanges" : ["0.0.0.0/0"]
  }
}'
```

The preceding command provisions a Cosmos DB database in Azure in the resource group *MyResourceGroup* in the *eastus* region. More information on *resourceGroup*, *location*, and other Azure-specific JSON parameters is available in the [Cosmos DB module reference documentation](https://github.com/Azure/open-service-broker-azure/blob/master/docs/modules/cosmosdb.md#provision-3).

To verify your database has completed provisioning, use the `svcat get instance` command:

```cmd
$ svcat get instance musicdb

   NAME     NAMESPACE              CLASS                PLAN     STATUS
+---------+-----------+------------------------------+---------+--------+
  musicdb   default     azure-cosmosdb-mongo-account   account   Ready
```

Your database is ready when see *Ready* under *STATUS*.

Once your database has completed provisioning, you need to bind its metadata to a [Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/). Other applications can then access that data after it has been bound to a secret. To bind the metadata of your database to a secret, use the `svcat bind` command:

```cmd
$ svcat bind musicdb

  Name:        musicdb
  Namespace:   default
  Status:
  Secret:      musicdb
  Instance:    musicdb

Parameters:
  No parameters defined
```


## Use the Cosmos DB database with your application

To use the Cosmos DB database with your application, you need to know the URI to connect to it. To get this information, use the `kubectl get secret` command:

```cmd
$ kubectl get secret musicdb -o=jsonpath='{.data.uri}' | base64 --decode

mongodb://12345678-90ab-cdef-1234-567890abcdef:aaaabbbbccccddddeeeeffffgggghhhhiiiijjjjkkkkllllmmmmnnnnooooppppqqqqrrrrssssttttuuuuvvvv@098765432-aaaa-bbbb-cccc-1234567890ab.documents.azure.com:10255/?ssl=true&replicaSet=globaldb
```

The preceding command gets the *musicdb* secret and displays only the URI. Secrets are stored in base64 format so the preceding command also decodes it.

Using the URI of the Cosmos DB database, update *src/main/resources/application.yml* to use it:

```yaml
...
---
spring:
  profiles: mongodb
  data:
    mongodb:
      uri: "mongodb://12345678-90ab-cdef-1234-567890abcdef:aaaabbbbccccddddeeeeffffgggghhhhiiiijjjjkkkkllllmmmmnnnnooooppppqqqqrrrrssssttttuuuuvvvv@098765432-aaaa-bbbb-cccc-1234567890ab.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
      database: musicdb
```

Updating the URI, which contains a username and password, directly to this file is for **development use only** and **should never be added to version control**.

Rebuild and start your application to begin using the Cosmos DB database:

```cmd
./gradlew clean assemble

java -jar -Dspring.profiles.active=mongodb build/libs/spring-music-1.0.jar
```

Notice your application still uses the *mongodb* profile and a URI that begins with *mongodb://* to connect to the Cosmos DB database. The [Azure Cosmos DB API for MongoDB](../cosmos-db/mongodb-introduction.md) provides this compatibility. It allows your application to continue to operate as if it is using a MongoDB database, but it is actually using Cosmos DB.

Navigate to `http://localhost:8080` in your browser. Notice the default data has been restored. Interact with it by deleting a few existing albums and creating a few new ones. You can verify your changes are persisted by stopping your application, restarting it, and navigating back to it in your browser. Notice the changes you have made are still there. The changes are persisted to the Cosmos DB you created using Open Service Broker for Azure.


## Run your application on your AKS cluster

You can use [Azure Dev Spaces](../dev-spaces/azure-dev-spaces.md) to deploy the application to your AKS cluster. Azure Dev Spaces helps you generate artifacts, such as Dockerfiles and Helm charts, and deploy and run an application in AKS.

To enable Azure Dev Spaces in your AKS cluster:

```cmd
az aks enable-addons --addons http_application_routing -g MyResourceGroup -n MyAKS
az aks use-dev-spaces -g MyResourceGroup -n MyAKS
```

Use the Azure Dev Spaces tooling to prepare your application to run in AKS:

```cmd
azds prep --public
```

This command generates several artifacts, including a *charts/* folder, which is your Helm chart, at the root of the project. This command cannot generate a *Dockerfile* for this specific project so you have to create it.

Create a file at the root of your project named *Dockerfile* with this content:

```Dockerfile
FROM openjdk:8-jdk-alpine
EXPOSE 8080
WORKDIR /app
COPY build/libs/spring-music-1.0.jar .
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Dspring.profiles.active=mongodb","-jar","/app/spring-music-1.0.jar"]
```

In addition, you need to update the *configurations.develop.build* property in *azds.yaml* to *false*:
```yaml
...
configurations:
  develop:
    build:
      useGitIgnore: false
```

You also need to update the *containerPort* attribute to *8080* in *charts/spring-music/templates/deployment.yaml*:

```yaml
...
spec:
  ...
  template:
    ...
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
```

To deploy your application to AKS:

```cmd
$ azds up

Using dev space 'default' with target 'MyAKS'
Synchronizing files...1m 18s
Installing Helm chart...5s
Waiting for container image build...23s
Building container image...
Step 1/5 : FROM openjdk:8-jdk-alpine
Step 2/5 : EXPOSE 8080
Step 3/5 : WORKDIR /app
Step 4/5 : COPY build/libs/spring-music-1.0.jar .
Step 5/5 : ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Dspring.profiles.active=mongodb","-jar","/app/spring-music-1.0.jar"]
Built container image in 21s
Waiting for container...8s
Service 'spring-music' port 'http' is available at http://spring-music.1234567890abcdef1234.eastus.aksapp.io/
Service 'spring-music' port 8080 (TCP) is available at http://localhost:57892
press Ctrl+C to detach
...
```

Navigate to the URL displayed in the logs. In the preceding example, you would use *http://spring-music.1234567890abcdef1234.eastus.aksapp.io/*. 

Verify you see the application along with your changes.

## Next steps

This article described how to update an existing application from using MongoDB to using Cosmos DB API for MongoDB. This article also covered how to provision a Cosmos DB service using Open Service Broker for Azure and deploying that application to AKS with Azure Dev Spaces.

For more information about Cosmos DB, Open Service Broker for Azure, and Azure Dev Spaces, see:
* [Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/)
* [Open Service Broker for Azure](https://osba.sh)
* [Develop with Dev Spaces](../dev-spaces/azure-dev-spaces.md)
