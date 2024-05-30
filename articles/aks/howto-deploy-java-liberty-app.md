---
title: Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster
recommendations: false
description: Deploy a Java application with Open Liberty or WebSphere Liberty on an AKS cluster by using the Azure Marketplace offer, which automatically provisions resources.
author: KarlErickson
ms.author: edburns
ms.topic: how-to
ms.date: 05/29/2024
ms.subservice: aks-developer
keywords: java, jakartaee, javaee, microprofile, open-liberty, websphere-liberty, aks, kubernetes
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-websphere, build-2023, devx-track-extended-java, devx-track-azurecli
---

# Deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article demonstrates how to:

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the [Open Liberty](https://openliberty.io/) or [IBM WebSphere Liberty](https://www.ibm.com/cloud/websphere-liberty) runtime.
* Build the application's Docker image by using Open Liberty or WebSphere Liberty container images.
* Deploy the containerized application to an Azure Kubernetes Service (AKS) cluster by using the Open Liberty Operator or WebSphere Liberty Operator.

The Open Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With the Open Liberty Operator or WebSphere Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps.

This article uses the Azure Marketplace offer for Open Liberty or WebSphere Liberty to accelerate your journey to AKS. The offer automatically provisions some Azure resources, including:

* An Azure Container Registry instance.
* An AKS cluster.
* An Application Gateway Ingress Controller (AGIC) instance.
* The Open Liberty Operator and WebSphere Liberty Operator.
* Optionally, a container image that includes Liberty and your application.

If you prefer manual step-by-step guidance for running Liberty on AKS, see [Manually deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/developer/java/ee/howto-deploy-java-liberty-app-manual).

This article is intended to help you quickly get to deployment. Before you go to production, you should explore the [IBM documentation about tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Install the [Azure CLI](/cli/azure/install-azure-cli). If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).
* Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).
* When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
* Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade). This article requires at least version 2.31.0 of Azure CLI.
* Install a Java Standard Edition (SE) implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
* Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
* Install [Docker](https://docs.docker.com/get-docker/) for your OS.
* Ensure [Git](https://git-scm.com) is installed.
* Make sure you're assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify it by following steps in [List role assignments for a user or group](../role-based-access-control/role-assignments-list-portal.yml).


> [!NOTE]
> You can also run the commands in this article from [Azure Cloud Shell](/azure/cloud-shell/quickstart). This approach has all the prerequisite tools preinstalled, with the exception of Docker.
>
> :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to open Azure Cloud Shell." border="false" link="https://shell.azure.com":::

* If running the commands in this guide locally (instead of Azure Cloud Shell):
  * Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, Azure Linux, macOS, Windows Subsystem for Linux).
  * Install a Java SE implementation, version 17 or later. (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
  * Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
  * Install [Docker](https://docs.docker.com/get-docker/) for your OS.
* Make sure you're assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify it by following steps in [List role assignments for a user or group](../role-based-access-control/role-assignments-list-portal.yml#list-role-assignments-for-a-user-or-group).

## Create a Liberty on AKS deployment using the portal

The following steps guide you to create a Liberty runtime on AKS. After you complete these steps, you'll have a Container Registry instance and an AKS cluster for deploying your containerized application.

1. Go to the [Azure portal](https://portal.azure.com/). In the search box at the top of the page, enter **IBM Liberty on AKS**. When the suggestions appear, select the one and only match in the **Marketplace** section.

   If you prefer, you can [go directly to the offer](https://aka.ms/liberty-aks).

1. Select **Create**.

1. On the **Basics** pane:

   1. Create a new resource group. Because resource groups must be unique within a subscription, choose a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier (for example, `ejb0913-java-liberty-project-rg`).
   1. For **Region**, select **East US**.

   1. Create an environment variable in your shell for the resource group names for the cluster and the database:

      ### [Bash](#tab/in-bash)

      ```bash
      export RESOURCE_GROUP_NAME=<your-resource-group-name>
      ```

      ### [PowerShell](#tab/in-powershell)

      ```powershell
      $Env:RESOURCE_GROUP_NAME="<your-resource-group-name>"
      ```

      ---

1. Select **Next**. On the **AKS** pane, you can optionally select an existing AKS cluster and Container Registry instance, instead of causing the deployment to create new ones. This choice enables you to use the sidecar pattern, as shown in the [Azure Architecture Center](/azure/architecture/patterns/sidecar). You can also adjust the settings for the size and number of the virtual machines in the AKS node pool.

   For the purposes of this article, just keep all the defaults on this pane.

1. Select **Next**. On the **Load Balancing** pane, next to **Connect to Azure Application Gateway?**, select **Yes**. In this section, you can customize the following deployment options:

   * For **Virtual network** and **Subnet**, you can optionally customize the virtual network and subnet into which the deployment places the resources. You don't need to change the remaining values from their defaults.
   * For **TLS/SSL certificate**, you can provide the TLS/SSL certificate from Azure Application Gateway. Leave the values at their defaults to cause the offer to generate a self-signed certificate.

     Don't go to production with a self-signed certificate. For more information about self-signed certificates, see [Create a self-signed public certificate to authenticate your application](../active-directory/develop/howto-create-self-signed-certificate.md).
   * You can select **Enable cookie based affinity**, also known as sticky sessions. This article uses sticky sessions, so be sure to select this option.

1. Select **Next**. On the **Operator and application** pane, this article uses all the defaults. However, you can customize the following deployment options:

   * You can deploy WebSphere Liberty Operator by selecting **Yes** for the option **IBM supported?**. Leaving the default **No** deploys Open Liberty Operator.
   * You can deploy an application for your selected operator by selecting **Yes** for the option **Deploy an application?**. Leaving the default **No** doesn't deploy any application.

1. Select **Review + create** to validate your selected options. On the **Review + create** pane, when you see **Create** become available after validation passes, select it.

   The deployment can take up to 20 minutes. While you wait for the deployment to finish, you can follow the steps in the section [Create an Azure SQL Database instance](#create-an-azure-sql-database-instance). After you complete that section, come back here and continue.

## Capture selected information from the deployment

If you moved away from the **Deployment is in progress** pane, the following steps show you how to get back to that pane. If you're still on the pane that shows **Your deployment is complete**, go to the newly created resource group and skip to the third step.

1. In the corner of any portal page, select the menu button, and then select **Resource groups**.
1. In the box with the text **Filter for any field**, enter the first few characters of the resource group that you created previously. If you followed the recommended convention, enter your initials, and then select the appropriate resource group.
1. In the list of resources in the resource group, select the resource with the **Type** value of **Container registry**.
1. On the navigation pane, under **Settings**, select **Access keys**.
1. Save aside the values for **Login server**, **Registry name**, **Username**, and **Password**. You can use the copy icon next to each field to copy the value to the system clipboard.
1. Go back to the resource group into which you deployed the resources.
1. In the **Settings** section, select **Deployments**.
1. Select the bottom-most deployment in the list. The **Deployment name** value matches the publisher ID of the offer. It contains the string `ibm`.
1. On the navigation pane, select **Outputs**.
1. By using the same copy technique as with the preceding values, save aside the values for the following outputs:

   * `cmdToConnectToCluster`
   * `appDeploymentTemplateYaml` if the deployment doesn't include an application. That is, you selected **No** for **Deploy an application?** when you deployed the Marketplace offer.
   * `appDeploymentYaml` if the deployment does include an application. That is, you selected **Yes** for **Deploy an application?**.

   ### [Bash](#tab/in-bash)

   Paste the value of `appDeploymentTemplateYaml` or `appDeploymentYaml` into a Bash shell, append `| grep secretName`, and run the command.

   The output of this command is the ingress TLS secret name, such as `- secretName: secret785e2c`. Save aside the `secretName` value.

   ### [PowerShell](#tab/in-powershell)

   Paste the quoted string in `appDeploymentTemplateYaml` or `appDeploymentYaml` into PowerShell (excluding the `| base64` portion), append `| ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) } | Select-String "secretName"`, and run the command.

   The output of this command is the ingress TLS secret name, such as `- secretName: secret785e2c`. Save aside the `secretName` value.

    ---

You use these values later in this article. The outputs list several other useful commands.

## Create an Azure SQL Database instance

[!INCLUDE [create-azure-sql-database](includes/jakartaee/create-azure-sql-database.md)]

Create an environment variable in your shell for the resource group name for the database:

### [Bash](#tab/in-bash)

```bash
export DB_RESOURCE_GROUP_NAME=<db-resource-group>
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:DB_RESOURCE_GROUP_NAME="<db-resource-group>"
```

---

Now that you created the database and AKS cluster, you can proceed to preparing AKS to host your Open Liberty application.

## Configure and deploy the sample application

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven.

### Check out the application

Clone the sample code for this article. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aks).

There are a few samples in the repository. This article uses *java-app/*. Run the following commands to get the sample:

#### [Bash](#tab/in-bash)

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
export BASE_DIR=$PWD
git checkout 20240220
```

#### [PowerShell](#tab/in-powershell)

```powershell
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
$env:BASE_DIR=$PWD.Path
git checkout 20240109
```

---

If you see a message about being in "detached HEAD" state, you can safely ignore it. The message just means that you checked out a tag.

Here's the file structure of the application:

```
java-app
├─ src/main/
│  ├─ aks/
│  │  ├─ db-secret.yaml
│  │  ├─ openlibertyapplication-agic.yaml
│  │  ├─ openlibertyapplication.yaml
│  │  ├─ webspherelibertyapplication-agic.yaml
│  │  ├─ webspherelibertyapplication.yaml
│  ├─ docker/
│  │  ├─ Dockerfile
│  │  ├─ Dockerfile-wlp
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ pom.xml
```

The directories *java*, *resources*, and *webapp* contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the *aks* directory, there are five deployment files:

* *db-secret.xml*: Use this file to create [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) with database connection credentials.
* *openlibertyapplication-agic.yaml*: Use this file to deploy the Open Liberty application with AGIC. This article assumes that you use this file.
* *openlibertyapplication.yaml*: Use this file if you want to deploy the Open Liberty application without AGIC.
* *webspherelibertyapplication-agic.yaml*: Use this file to deploy the WebSphere Liberty application with AGIC if you deployed WebSphere Liberty Operator [earlier in this article](#create-a-liberty-on-aks-deployment-using-the-portal).
* *webspherelibertyapplication.yaml*: Use this file to deploy the WebSphere Liberty application without AGIC if you deployed WebSphere Liberty Operator earlier in this article.

In the *docker* directory, there are two files to create the application image:

* *Dockerfile*: Use this file to build the application image with Open Liberty in this article.
* *Dockerfile-wlp*: Use this file to build the application image with WebSphere Liberty if you deployed WebSphere Liberty Operator earlier in this article.

In the *liberty/config* directory, you use the *server.xml* file to configure the database connection for the Open Liberty and WebSphere Liberty cluster.

### Build the project

Now that you have the necessary properties, you can build the application. The POM file for the project reads many variables from the environment. As part of the Maven build, these variables are used to populate values in the YAML files located in *src/main/aks*. You can do something similar for your application outside Maven if you prefer.

#### [Bash](#tab/in-bash)

```bash
cd $BASE_DIR/java-app
# The following variables are used for deployment file generation into the target.
export LOGIN_SERVER=<Azure-Container-Registry-Login-Server-URL>
export REGISTRY_NAME=<Azure-Container-Registry-name>
export USER_NAME=<Azure-Container-Registry-username>
export PASSWORD='<Azure-Container-Registry-password>'
export DB_SERVER_NAME=<server-name>.database.windows.net
export DB_NAME=<database-name>
export DB_USER=<server-admin-login>@<server-name>
export DB_PASSWORD='<server-admin-password>'
export INGRESS_TLS_SECRET=<ingress-TLS-secret-name>

mvn clean install
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd $env:BASE_DIR\java-app

# The following variables are used for deployment file generation into the target.
$Env:LOGIN_SERVER="<Azure-Container-Registry-Login-Server-URL>"
$Env:REGISTRY_NAME="<Azure-Container-Registry-name>"
$Env:USER_NAME="<Azure-Container-Registry-username>"
$Env:PASSWORD="<Azure-Container-Registry-password>"
$Env:DB_SERVER_NAME="<server-name>.database.windows.net"
$Env:DB_NAME="<database-name>"
$Env:DB_USER="<server-admin-login>@<server-name>"
$Env:DB_PASSWORD="<server-admin-password>"
$Env:INGRESS_TLS_SECRET="<ingress-TLS-secret-name>"

mvn clean install
```

---

### (Optional) Test your project locally

Run and test the project locally before deploying to Azure. For convenience, this article uses `liberty-maven-plugin`. To learn more about `liberty-maven-plugin`, see the Open Liberty article [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

For your application, you can do something similar by using any other mechanism, such as your local development environment. You can also consider using the `liberty:devc` option intended for development with containers. You can read more about `liberty:devc` in the [Open Liberty documentation](https://openliberty.io/docs/latest/development-mode.html#_container_support_for_dev_mode).

1. Start the application by using `liberty:run`. `liberty:run` also uses the environment variables that you defined earlier.

   #### [Bash](#tab/in-bash)

   ```bash
   cd $BASE_DIR/java-app
   mvn liberty:run
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   cd $env:BASE_DIR\java-app
   mvn liberty:run
   ```

    ---

1. If the test is successful, a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds` appears in the command output. Go to `http://localhost:9080/` in your browser and verify that the application is accessible and all functions are working.

1. Select <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Build the image for AKS deployment

You can now run the `docker build` command to build the image:

#### [Bash](#tab/in-bash)

```bash
cd $BASE_DIR/java-app/target

docker buildx build --platform linux/amd64 -t javaee-cafe:v1 --pull --file=Dockerfile .
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd $env:BASE_DIR\java-app\target

docker build -t javaee-cafe:v1 --pull --file=Dockerfile .
```

---

### (Optional) Test the Docker image locally

Use the following steps to test the Docker image locally before deploying to Azure:

1. Run the image by using the following command. This command uses the environment variables that you defined previously.

   #### [Bash](#tab/in-bash)

   ```bash
   docker run -it --rm -p 9080:9080 \
      -e DB_SERVER_NAME=${DB_SERVER_NAME} \
      -e DB_NAME=${DB_NAME} \
      -e DB_USER=${DB_USER} \
      -e DB_PASSWORD=${DB_PASSWORD} \
      javaee-cafe:v1
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   docker run -it --rm -p 9080:9080 `
      -e DB_SERVER_NAME=${Env:DB_SERVER_NAME} `
      -e DB_NAME=${Env:DB_NAME} `
      -e DB_USER=${Env:DB_USER} `
      -e DB_PASSWORD=${Env:DB_PASSWORD} `
      javaee-cafe:v1
   ```

    ---

1. After the container starts, go to `http://localhost:9080/` in your browser to access the application.

1. Select <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Upload the image to Azure Container Registry

Upload the built image to the Container Registry instance that you created in the offer:

#### [Bash](#tab/in-bash)

```bash
docker tag javaee-cafe:v1 ${LOGIN_SERVER}/javaee-cafe:v1
docker login -u ${USER_NAME} -p ${PASSWORD} ${LOGIN_SERVER}
docker push ${LOGIN_SERVER}/javaee-cafe:v1
```

#### [PowerShell](#tab/in-powershell)

```powershell
docker tag javaee-cafe:v1 ${Env:LOGIN_SERVER}/javaee-cafe:v1
docker login -u ${Env:USER_NAME} -p ${Env:PASSWORD} ${Env:LOGIN_SERVER}
docker push ${Env:LOGIN_SERVER}/javaee-cafe:v1
```

---

### Deploy and test the application

Use the following steps to deploy and test the application:

1. Connect to the AKS cluster.

   Paste the value of `cmdToConnectToCluster` into a shell and run the command.

1. Apply the database secret:

   #### [Bash](#tab/in-bash)

   ```bash
   cd $BASE_DIR/java-app/target
   kubectl apply -f db-secret.yaml
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   cd $env:BASE_DIR\java-app\target
   kubectl apply -f db-secret.yaml
   ```

    ---

   The output is `secret/db-secret-sql created`.

1. Apply the deployment file:

   #### [Bash](#tab/in-bash)

   ```bash
   kubectl apply -f openlibertyapplication-agic.yaml
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   kubectl apply -f openlibertyapplication-agic.yaml
   ```

    ---

1. Wait until all pods are restarted successfully by using the following command:

   #### [Bash](#tab/in-bash)

   ```bash
   kubectl get pods --watch
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   kubectl get pods --watch
   ```

    ---   

   Output similar to the following example indicates that all the pods are running:

   ```output
   NAME                                       READY   STATUS    RESTARTS   AGE
   javaee-cafe-cluster-agic-67cdc95bc-2j2gr   1/1     Running   0          29s
   javaee-cafe-cluster-agic-67cdc95bc-fgtt8   1/1     Running   0          29s
   javaee-cafe-cluster-agic-67cdc95bc-h47qm   1/1     Running   0          29s
   ```

1. Verify the results:

   1. Get the address of the ingress resource deployed with the application:

      #### [Bash](#tab/in-bash)

      ```bash
      kubectl get ingress
      ```

      #### [PowerShell](#tab/in-powershell)

      ```powershell
      kubectl get ingress
      ```

       ---      

      Copy the value of `ADDRESS` from the output. This value is the front-end public IP address of the deployed Application Gateway instance.

   1. Go to `https://<ADDRESS>` to test the application. For your convenience, this shell command creates an environment variable whose value you can paste straight into the browser:

      #### [Bash](#tab/in-bash)

      ```bash
      export APP_URL=https://$(kubectl get ingress | grep javaee-cafe-cluster-agic-ingress | cut -d " " -f14)/
      echo $APP_URL
      ```

      #### [PowerShell](#tab/in-powershell)

      ```powershell
      $APP_URL = "https://$(kubectl get ingress | Select-String 'javaee-cafe-cluster-agic-ingress' | ForEach-Object { $_.Line.Split(' ')[13] })/"
      $APP_URL
      ```

       ---

      If the webpage doesn't render correctly or returns a `502 Bad Gateway` error, the app is still starting in the background. Wait for a few minutes and then try again.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, the container service, the container registry, the database, and all related resources:

### [Bash](#tab/in-bash)

```bash
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $DB_RESOURCE_GROUP_NAME --yes --no-wait
```

### [PowerShell](#tab/in-powershell)

```powershell
az group delete --name $Env:RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $Env:DB_RESOURCE_GROUP_NAME --yes --no-wait
```

---

## Next steps

You can learn more from the following references:

* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty server configuration](https://openliberty.io/docs/ref/config/)
