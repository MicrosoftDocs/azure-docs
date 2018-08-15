---
title: Create a Linux container app on Service Fabric in Azure | Microsoft Docs
description: In this quickstart, you will build a Docker image with your application, push the image to a container registry, and then deploy your container to a Service Fabric cluster.
services: service-fabric
documentationcenter: linux
author: suhuruli
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: python
ms.topic: quickstart
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/11/2018
ms.author: suhuruli
ms.custom: mvc

---
# Quickstart: Deploy Linux containers to Service Fabric

Azure Service Fabric is a distributed systems platform for deploying and managing scalable and reliable microservices and containers.

This quickstart shows how to deploy Linux containers to a Service Fabric cluster. Once complete, you have a voting application consisting of a Python web front end and a Redis back end running in a Service Fabric cluster. You also learn how to fail over an application and how to scale an application in your cluster.

![Voting app web page][quickstartpic]

In this quickstart, you use the Bash environment in Azure Cloud Shell to run Service Fabric CLI commands. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If it is your first time running Cloud Shell, you are asked to set up your `clouddrive` file share. You can accept the defaults or attach an existing file share. To learn more, see [Set up a `clouddrive` file share](https://docs.microsoft.com/azure/cloud-shell/persisting-shell-storage#set-up-a-clouddrive-file-share).

## Get the application package

To deploy containers to Service Fabric, you need a set of manifest files (the application definition), which describe the individual containers and the application.

In the Cloud Shell, use git to clone a copy of the application definition; then change directories to the `Voting` directory in your clone.

```bash
git clone https://github.com/Azure-Samples/service-fabric-containers.git

cd service-fabric-containers/Linux/container-tutorial/Voting
```

## Create a Service Fabric cluster

To deploy the application to Azure, you need a Service Fabric cluster to run the application. Party clusters offer an easy way to quickly create a Service Fabric cluster. Party clusters are free, limited-time Service Fabric clusters hosted on Azure and run by the Service Fabric team. You can use party clusters to deploy applications and learn about the platform. The cluster uses a single, self-signed certificate for node-to-node and client-to-node security.

Sign in and join a [Linux cluster](http://aka.ms/tryservicefabric). Download the PFX certificate to your computer by clicking the **PFX** link. Click the **ReadMe** link to find the certificate password and instructions about how to configure various environments to use the certificate. Keep both the **Welcome** page and the **ReadMe** page open, you will use some of the instructions in the following steps.

> [!Note]
> There are a limited number of party clusters available per hour. If you get an error when you try to sign up for a party cluster, you can wait for a period and try again, or you can follow these steps in [Create a Service Fabric cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md) to create a cluster in your subscription.
>
>If you do create your own cluster, note that the web front end service is configured to listen on port 80 for incoming traffic. Make sure that port is open in your cluster. (If you are using a party cluster, this port is open.)
>

## Configure your environment

Service Fabric provides several tools that you can use to manage a cluster and its applications:

- Service Fabric Explorer, a browser-based tool.
- Service Fabric Command Line Interface (CLI), which runs on top of Azure CLI. 
- PowerShell commands.

In this quickstart, you use the Service Fabric CLI in Cloud Shell and Service Fabric Explorer. The following sections show you how to install the certificate needed to connect to your secure cluster with these tools.

### Configure certificate for the Service Fabric CLI

To use the CLI in Cloud Shell, you need to upload the certificate PFX file to Cloud Shell and then use it to create a PEM file.

1. To upload the certificate to your current working directory in Cloud Shell, drag the certificate PFX file from the folder where it downloaded on your computer and drop into your Cloud Shell window.

2. To convert the PFX file to a PEM file, use the following command. (For party clusters, you can copy a command specific to your PFX file and password from the instructions on the **ReadMe** page.)

    ```bash
    openssl pkcs12 -in party-cluster-1486790479-client-cert.pfx -out party-cluster-1486790479-client-cert.pem -nodes -passin pass:1486790479
    ```

### Configure certificate for Service Fabric Explorer

To use Service Fabric Explorer, you need to import the certificate PFX file you downloaded from the Party Cluster website into your certificate store (Windows or Mac) or into the browser itself (Ubuntu). You need the PFX private key password, which you can get from the **ReadMe** page.

Use whatever method you are most comfortable with to import the certificate on your system. For example:

- On Windows: Double-click the PFX file and follow the prompts to install the certificate in your personal store, `Certificates - Current User\Personal\Certificates`. Alternatively, you can use the PowerShell command in the **ReadMe** instructions.
- On Mac: Double-click the PFX file and follow the prompts to install the certificate in your Keychain.
- On Ubuntu: Mozilla Firefox is the default browser in Ubuntu 16.04. To import the certificate into Firefox, click the menu button in the upper right corner of your browser, then click **Options**. On the **Preferences** page, use the search box to search for "certificates". Click **View Certificates**, select the **Your Certificates** tab, click **Import** and follow the prompts to import the certificate.

   ![Install certificate on Firefox](./media/service-fabric-quickstart-containers-linux/install-cert-firefox.png)

## Deploy the Service Fabric application

1. In Cloud Shell, connect to the Service Fabric cluster in Azure using the CLI. The endpoint is the management endpoint for your cluster. You created the PEM file in the previous section. (For party clusters, you can copy a command specific to your PEM file and management endpoint from the instructions on the **ReadMe** page.)

    ```bash
    sfctl cluster select --endpoint https://linh1x87d1d.westus.cloudapp.azure.com:19080 --pem party-cluster-1277863181-client-cert.pem --no-verify
    ```

2. Use the install script to copy the Voting application definition to the cluster, register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

3. Open a web browser and navigate to the Service Fabric Explorer endpoint for your cluster. The endpoint has the following format:  **https://\<my-azure-service-fabric-cluster-url>:19080/Explorer**; for example, `https://linh1x87d1d.westus.cloudapp.azure.com:19080/Explorer`. </br>(For party clusters, you can find the Service Fabric Explorer endpoint for your cluster on the **Welcome** page.)

4. Expand the **Applications** node to see that there is now an entry for the Voting application type and the instance you created.

    ![Service Fabric Explorer][sfx]

5. To connect to the running container, open a web browser and navigate to the URL of your cluster; for example, `http://linh1x87d1d.westus.cloudapp.azure.com:80`. You should see the Voting application in the browser.

    ![Voting app web page][quickstartpic]

> [!NOTE]
> You can also deploy Service Fabric applications with Docker compose. For example, the following command could be used to deploy and install the application on the cluster using Docker Compose.
>  ```bash
> sfctl compose create --deployment-name TestApp --file-path ../docker-compose.yml
> ```

## Fail over a container in a cluster

Service Fabric makes sure that your container instances automatically move to other nodes in the cluster if a failure occurs. You can also manually drain a node for containers and move then gracefully to other nodes in the cluster. Service Fabric provides several ways to scale your services. In the following steps, you use Service Fabric Explorer.

To fail over the front-end container, do the following steps:

1. Open Service Fabric Explorer in your cluster; for example, `https://linh1x87d1d.westus.cloudapp.azure.com:19080/Explorer`.
2. Click the **fabric:/Voting/azurevotefront** node in the tree view and expand the partition node (represented by a GUID). Notice the node name in the treeview, which shows you the nodes that the container is currently running on; for example, `_nodetype_4`.
3. Expand the **Nodes** node in the tree view. Click the ellipsis (...) next to the node that is running the container.
4. Choose **Restart** to restart that node and confirm the restart action. The restart causes the container to fail over to another node in the cluster.

    ![Node view in Service Fabric Explorer][sfxquickstartshownodetype]

## Scale applications and services in a cluster

Service Fabric services can easily be scaled across a cluster to accommodate for the load on the services. You scale a service by changing the number of instances running in the cluster.

To scale the web front-end service, do the following steps:

1. Open Service Fabric Explorer in your cluster; for example,`https://linh1x87d1d.westus.cloudapp.azure.com:19080`.
2. Click the ellipsis (three dots) next to the **fabric:/Voting/azurevotefront** node in the treeview and choose **Scale Service**.

    ![Service Fabric Explorer scale service start][containersquickstartscale]

    You can now choose to scale the number of instances of the web front-end service.

3. Change the number to **2** and click **Scale Service**.
4. Click the **fabric:/Voting/azurevotefront** node in the tree-view and expand the partition node (represented by a GUID).

    ![Service Fabric Explorer scale service finished][containersquickstartscaledone]

    You can now see that the service has two instances. In the tree view, you can see which nodes the instances run on.

Through this simple management task, you've doubled the resources available for the front-end service to process user load. It's important to understand that you don't need multiple instances of a service for it to run reliably. If a service fails, Service Fabric makes sure that a new service instance runs in the cluster.

## Clean up resources

1. Use the uninstall script (uninstall.sh) provided in the template to delete the application instance from the cluster and unregister the application type. This script takes some time to clean up the instance, so you should not run the install script immediately after this script. You can use Service Fabric Explorer to determine when the instance has been removed and the application type unregistered.

    ```bash
    ./uninstall.sh
    ```

2. If you are finished working with your cluster, you can remove the certificate from your certificate store. For example:
   - On Windows: Use the [Certificates MMC snap-in](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in). Be sure to select **My user account** when adding the snap-in. Navigate to `Certificates - Current User\Personal\Certificates` and remove the certificate.
   - On Mac: Use the Keychain app.
   - On Ubuntu: Follow the steps you used to view certificates and remove the certificate.

3. If you don't want to continue to use Cloud Shell, you can delete the storage account associated with it to avoid charges. Close your Cloud Shell session. In Azure portal, click the storage account associated with Cloud Shell, then click **Delete** at the top of the page and respond to the prompts.

## Next steps

In this quickstart, you've deployed a Linux container application to a Service Fabric cluster in Azure, performed fail-over on the application, and scaled the application in the cluster. To learn more about working with Linux containers in Service Fabric, continue to the tutorial for Linux container apps.

> [!div class="nextstepaction"]
> [Create a Linux container app](./service-fabric-tutorial-create-container-images.md)

[sfx]: ./media/service-fabric-quickstart-containers-linux/containersquickstartappinstance.png
[quickstartpic]: ./media/service-fabric-quickstart-containers-linux/votingapp.png
[sfxquickstartshownodetype]:  ./media/service-fabric-quickstart-containers-linux/containersquickstartrestart.png
[containersquickstartscale]: ./media/service-fabric-quickstart-containers-linux/containersquickstartscale.png
[containersquickstartscaledone]: ./media/service-fabric-quickstart-containers-linux/containersquickstartscaledone.png
