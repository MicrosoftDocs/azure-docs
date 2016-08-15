<properties
	pageTitle="Build and deploy a Java API app in Azure App Service"
	description="Learn how to create a Java API app package and deploy it to Azure App Service."
	services="app-service\api"
	documentationCenter="java"
	authors="bradygaster"
	manager="mohisri"
	editor="tdykstra"/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="java"
	ms.topic="get-started-article"
	ms.date="06/01/2016"
	ms.author="rachelap"/>

# Build and deploy a Java API app in Azure App Service

[AZURE.INCLUDE [app-service-api-get-started-selector](../../includes/app-service-api-get-started-selector.md)]

This tutorial shows how to create a Java application and deploy it to Azure App Service API Apps using [Git]. The instructions in this tutorial can be followed on any operating system that is capable of running Java. The code in this tutorial is built using [Maven]. [Jax-RS] is used to create the RESTful Service, and is generated based on the [Swagger] metadata specification using the [Swagger Editor].

## Prerequisites

1. [Java Developer's Kit 8] (or later)
1. [Maven] installed on your development machine
1. [Git] installed on your development machine
1. A paid or [free trial] subscription to [Microsoft Azure]
1. An HTTP test application like [Postman]

## Scaffold the API using Swagger.IO

Using the swagger.io online editor, you can enter Swagger JSON or YAML code representing the structure of your API. Once you have the API surface area designed, you can export code for a variety of platforms and frameworks. In the next section, the scaffolded code will be modified to include mock functionality. 

This demonstration will begin with a Swagger JSON body that you will paste into the swagger.io editor, which will then be used to generate code making use of JAX-RS to access a REST API endpoint. Then, you'll edit the scaffolded code to return mock data, simulating a REST API built atop a data persistence mechanism.  

1. Copy the following Swagger JSON code to your clipboard:

        {
            "swagger": "2.0",
            "info": {
                "version": "v1",
                "title": "Contact List",
                "description": "A Contact list API based on Swagger and built using Java"
            },
            "host": "localhost",
            "schemes": [
                "http",
                "https"
            ],
            "basePath": "/api",
            "paths": {
                "/contacts": {
                    "get": {
                        "tags": [
                            "Contact"
                        ],
                        "operationId": "contacts_get",
                        "consumes": [],
                        "produces": [
                            "application/json",
                            "text/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "OK",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Contact"
                                    }
                                }
                            }
                        },
                        "deprecated": false
                    }
                },
                "/contacts/{id}": {
                    "get": {
                        "tags": [
                            "Contact"
                        ],
                        "operationId": "contacts_getById",
                        "consumes": [],
                        "produces": [
                            "application/json",
                            "text/json"
                        ],
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "type": "integer",
                                "format": "int32"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "OK",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Contact"
                                    }
                                }
                            }
                        },
                        "deprecated": false
                    }
                }
            },
            "definitions": {
                "Contact": {
                    "type": "object",
                    "properties": {
                        "Id": {
                            "format": "int32",
                            "type": "integer"
                        },
                        "Name": {
                            "type": "string"
                        },
                        "EmailAddress": {
                            "type": "string"
                        }
                    }
                }
            }
        }

1. Navigate to the [Online Swagger Editor]. Once there, click the **File -> Paste JSON** menu item.

    ![Paste JSON menu item][paste-json]

1. Paste in the Contacts List API Swagger JSON you copied earlier. 

    ![Pasting JSON code into Swagger][pasted-swagger]

1. View the documentation pages and API summary rendered in the editor. 

    ![View Swagger Generated Docs][view-swagger-generated-docs]

1. Select the **Generate Server -> JAX-RS** menu option to scaffold the server-side code you'll edit later to add mock implementation. 

    ![Generate Code Menu Item][generate-code-menu-item]

    Once the code is generated, you'll be provided a ZIP file to download. This file contains the code scaffolded by the Swagger code generator and all associated build scripts. Unzip the entire library to a directory on your development workstation. 

## Edit the Code to add API Implementation

In this section, you'll replace the Swagger-generated code's server-side implementation with your custom code. The new code will return an ArrayList of Contact entities to the calling client. 

1. Open the *Contact.java* model file, which is located in the *src/gen/java/io/swagger/model* folder, using [Visual Studio Code] or your favorite text editor. 

    ![Open Contact Model File][open-contact-model-file]

1. Add the following constructor to the **Contact** class. 

        public Contact(Integer id, String name, String email) 
        {
            this.id = id;
            this.name = name;
            this.emailAddress = email;
        }

1. Open the *ContactsApiServiceImpl.java* service implementation file, which is located in the *src/main/java/io/swagger/api/impl* folder, using [Visual Studio Code] or your favorite text editor.

    ![Open Contact Service Code File][open-contact-service-code-file]

1. Overwrite the code in the file with this new code to add a mock implementation to the service code. 

        package io.swagger.api.impl;

        import io.swagger.api.*;
        import io.swagger.model.*;
        import com.sun.jersey.multipart.FormDataParam;
        import io.swagger.model.Contact;
        import java.util.*;
        import io.swagger.api.NotFoundException;
        import java.io.InputStream;
        import com.sun.jersey.core.header.FormDataContentDisposition;
        import com.sun.jersey.multipart.FormDataParam;
        import javax.ws.rs.core.Response;
        import javax.ws.rs.core.SecurityContext;

        @javax.annotation.Generated(value = "class io.swagger.codegen.languages.JaxRSServerCodegen", date = "2015-11-24T21:54:11.648Z")
        public class ContactsApiServiceImpl extends ContactsApiService {
  
            private ArrayList<Contact> loadContacts()
            {
                ArrayList<Contact> list = new ArrayList<Contact>();
                list.add(new Contact(1, "Barney Poland", "barney@contoso.com"));
                list.add(new Contact(2, "Lacy Barrera", "lacy@contoso.com"));
                list.add(new Contact(3, "Lora Riggs", "lora@contoso.com"));
                return list;
            }
  
            @Override
            public Response contactsGet(SecurityContext securityContext)
            throws NotFoundException {
                ArrayList<Contact> list = loadContacts();
                return Response.ok().entity(list).build();
                }
  
            @Override
            public Response contactsGetById(Integer id, SecurityContext securityContext)
            throws NotFoundException {
                ArrayList<Contact> list = loadContacts();
                Contact ret = null;
            
                for(int i=0; i<list.size(); i++)
                {
                    if(list.get(i).getId() == id)
                        {
                            ret = list.get(i);
                        }
                }
                return Response.ok().entity(ret).build();
            }
        }

1. Open a command prompt and change directory to the root folder of your application.

1. Execute the following Maven command to build the code and run it using the Jetty app server locally. 

        mvn package jetty:run

1. You should see the command window reflect that Jetty has started your code on port 8080. 

    ![Open Contact Service Code File][run-jetty-war]

1. Use [Postman] to make a request to the "get all contacts" API method at http://localhost:8080/api/contacts.

    ![Call the Contacts API][calling-contacts-api]

1. Use [Postman] to make a request to the "get specific contact" API method located at http://localhost:8080/api/contacts/2.

    ![Call the Contacts API][calling-specific-contact-api]

1. Finally, build the Java WAR (Web ARchive) file by executing the following Maven command in your console. 

        mvn package war:war

1. Once the WAR file is built, it will be placed into the **target** folder. Navigate into the **target** folder and rename the WAR file to **ROOT.war**. (Make sure the capitalization matches this format).

         rename swagger-jaxrs-server-1.0.0.war ROOT.war

1. Finally, execute the following commands from the root folder of your application to create a **deploy** folder to use to deploy the WAR file to Azure. 

         mkdir deploy
         mkdir deploy\webapps
         copy target\ROOT.war deploy\webapps
         cd deploy

## Publish the output to Azure App Service

In this section you'll learn how to create a new API App using the Azure Portal, prepare that API App for hosting Java applications, and deploy the newly-created WAR file to Azure App Service to run your new API App. 

1. Create a new API app in the [Azure portal], by clicking the **New -> Web + Mobile -> API app** menu item, entering your app details, and then clicking **Create**.

    ![Create a new API App][create-api-app]

1. Once your API app has been created, open your app's **Settings** blade, and then click the **Application settings** menu item. Select the latest Java versions from the available options, then select the latest Tomcat from the **Web container** menu, and then click **Save**.

    ![Set up Java in the API App blade][set-up-java]

1. Click the **Deployment credentials** settings menu item, and provide a username and password you wish to use for publishing files to your API App. 

    ![Set deployment credentials][deployment-credentials]

1. Click the **Deployment source** settings menu item. Once there, click the **Choose source** button, select the **Local Git Repository** option, and then click **OK**. This will create a Git repository running in Azure, that has an association with your API App. Each time you commit code to the *master* branch of your Git repository, your code will be published into your live running API App instance. 

    ![Set up a new local Git repository][select-git-repo]

1. Copy the new Git repository's URL to your clipboard. Save this as it will be important in a moment. 

    ![Set up a new Git repository for your app][copy-git-repo-url]

1. Git push the WAR file to the online repository. To do this, navigate into the **deploy** folder you created earlier so that you can easily commit the code up to the repository running in your App Service. Once you're in the console window and navigated into the folder where the webapps folder is located, issue the following Git commands to launch the process and fire off a deployment. 

         git init
         git add .
         git commit -m "initial commit"
         git remote add azure [YOUR GIT URL]
         git push azure master

    Once you issue the **push** request, you'll be asked for the password you created for the deployment credential earlier. After you enter your credentials, you should see your portal display that the update was deployed.

1. If you once again use Postman to hit the newly-deployed API App running in Azure App Service, you'll see that the behavior is consistent and that now it is returning contact data as expected, and using simple code changes to the Swagger.io scaffolded Java code. 

    ![Using your Java Contacts REST API live in Azure][postman-calling-azure-contacts]

## Next steps

In this article, you were able to start with a Swagger JSON file and some scaffolded Java code obtained from the Swagger.io editor. From there, your simple changes and a Git deploy process resulted in having a functional API app written in Java. The next tutorial shows how to [consume API apps from JavaScript clients, using CORS][App Service API CORS]. Later tutorials in the series show how to implement authentication and authorization.

To build on this sample, you can learn more about the [Storage SDK for Java] to persist the JSON blobs. Or, you could use the [Document DB Java SDK] to save your Contact data to Azure Document DB. 

For more information about using Java in Azure, see the [Java Developer Center].

<!-- URL List -->

[App Service API CORS]: app-service-api-cors-consume-javascript.md
[Azure portal]: https://portal.azure.com/
[Document DB Java SDK]: ../documentdb/documentdb-java-application.md
[free trial]: https://azure.microsoft.com/pricing/free-trial/
[Git]: http://www.git-scm.com/
[Java Developer Center]: /develop/java/
[Java Developer's Kit 8]: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
[Jax-RS]: https://jax-rs-spec.java.net/
[Maven]: https://maven.apache.org/
[Microsoft Azure]: https://azure.microsoft.com/
[Online Swagger Editor]: http://editor.swagger.io/
[Postman]: https://www.getpostman.com/
[Storage SDK for Java]: ../storage/storage-java-how-to-use-blob-storage.md
[Swagger]: http://swagger.io/
[Swagger Editor]: http://editor.swagger.io/
[Visual Studio Code]: https://code.visualstudio.com

<!-- IMG List -->

[paste-json]: ./media/app-service-api-java-api-app/paste-json.png
[pasted-swagger]: ./media/app-service-api-java-api-app/pasted-swagger.png
[view-swagger-generated-docs]: ./media/app-service-api-java-api-app/view-swagger-generated-docs.png
[generate-code-menu-item]: ./media/app-service-api-java-api-app/generate-code-menu-item.png
[open-contact-model-file]: ./media/app-service-api-java-api-app/open-contact-model-file.png
[open-contact-service-code-file]: ./media/app-service-api-java-api-app/open-contact-service-code-file.png
[run-jetty-war]: ./media/app-service-api-java-api-app/run-jetty-war.png
[calling-contacts-api]: ./media/app-service-api-java-api-app/calling-contacts-api.png
[calling-specific-contact-api]: ./media/app-service-api-java-api-app/calling-specific-contact-api.png
[create-api-app]: ./media/app-service-api-java-api-app/create-api-app.png
[set-up-java]: ./media/app-service-api-java-api-app/set-up-java.png
[deployment-credentials]: ./media/app-service-api-java-api-app/deployment-credentials.png
[select-git-repo]: ./media/app-service-api-java-api-app/select-git-repo.png
[copy-git-repo-url]: ./media/app-service-api-java-api-app/copy-git-repo-url.png
[postman-calling-azure-contacts]: ./media/app-service-api-java-api-app/postman-calling-azure-contacts.png
