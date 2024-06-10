---
title: "WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift"
description: Shows you how to quickly stand up IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 05/29/2024
ms.custom: template-overview, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aro, devx-track-javaee-websphere, devx-track-extended-java
---

# Deploy WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift

This article shows you how to quickly stand up IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift (ARO) using the Azure portal.

This article uses the Azure Marketplace offer for Open/WebSphere Liberty to accelerate your journey to ARO. The offer automatically provisions several resources including an ARO cluster with a built-in OpenShift Container Registry (OCR), the Liberty Operators, and optionally a container image including Liberty and your application. To see the offer, visit the [Azure portal](https://aka.ms/liberty-aro). If you prefer manual step-by-step guidance for running Liberty on ARO that doesn't utilize the automation enabled by the offer, see [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift cluster](/azure/developer/java/ee/liberty-on-aro).

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

[!INCLUDE [aro-support](includes/aro-support.md)]

[!INCLUDE [aro-quota](includes/aro-quota.md)]

## Prerequisites

- A local machine with a Unix-like operating system installed (for example, Ubuntu, macOS, or Windows Subsystem for Linux).
- The [Azure CLI](/cli/azure/install-azure-cli). If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).
* Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).
* When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
* Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade). This article requires at least version 2.31.0 of Azure CLI.
- A Java Standard Edition (SE) implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
- [Maven](https://maven.apache.org/download.cgi) version 3.5.0 or higher.
- [Docker](https://docs.docker.com/get-docker/) for your OS.
- The Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role and the [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

> [!NOTE]
> You can also execute this guidance from the [Azure Cloud Shell](/azure/cloud-shell/quickstart). This approach has all the prerequisite tools pre-installed, with the exception of Docker.
>
> :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

## Get a Red Hat pull secret

The Azure Marketplace offer you're going to use in this article requires a Red Hat pull secret. This section shows you how to get a Red Hat pull secret for Azure Red Hat OpenShift. To learn about what a Red Hat pull secret is and why you need it, see the [Get a Red Hat pull secret](/azure/openshift/tutorial-create-cluster?WT.mc_id=Portal-fx#get-a-red-hat-pull-secret-optional) section of [Tutorial: Create an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-create-cluster?WT.mc_id=Portal-fx). To get the pull secret for use, follow the steps in this section.

Use your Red Hat account to sign in to the OpenShift cluster manager portal, by visiting the [Red Hat OpenShift Hybrid Cloud Console](https://console.redhat.com/openshift/install/azure/aro-provisioned). You might need to accept more terms and update your account as shown in the following screenshot. Use the same password as when you created the account.

:::image type="content" source="media/howto-deploy-java-liberty-app/red-hat-account-complete-profile.png" alt-text="Screenshot of Red Hat Update Your Account page." lightbox="media/howto-deploy-java-liberty-app/red-hat-account-complete-profile.png":::

After you sign in, select **OpenShift**, then **Downloads**. Select the **All categories** dropdown list and then select **Tokens**. Under **Pull secret**, select **Copy** or **Download**, as shown in the following screenshot.

:::image type="content" source="media/howto-deploy-java-liberty-app/red-hat-console-portal-pull-secret.png" alt-text="Screenshot of Red Hat console portal showing the pull secret." lightbox="media/howto-deploy-java-liberty-app/red-hat-console-portal-pull-secret.png":::

The following content is an example that was copied from the Red Hat console portal, with the auth codes replaced with `xxxx...xxx`.

```json
{"auths":{"cloud.openshift.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"quay.io":{"auth":"xxx...xxx","email":"contoso-user@test.com"},"registry.connect.redhat.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"registry.redhat.io":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"}}}
```

Save the secret to a file so you can use it later.

## Create a Microsoft Entra service principal from the Azure portal

The Azure Marketplace offer you're going to use in this article requires a Microsoft Entra service principal to deploy your Azure Red Hat OpenShift cluster. The offer assigns the service principal with proper privileges during deployment time, with no role assignment needed. If you have a service principal ready to use, skip this section and move on to the next section, where you deploy the offer.

Use the following steps to deploy a service principal and get its Application (client) ID and secret from the Azure portal. For more information, see [Create and use a service principal to deploy an Azure Red Hat OpenShift cluster](/azure/openshift/howto-create-service-principal?pivots=aro-azureportal).

> [!NOTE]
> You must have sufficient permissions to register an application with your Microsoft Entra tenant. If you run into a problem, check the required permissions to make sure your account can create the identity. For more information, see the [Permissions required for registering an app](/azure/active-directory/develop/howto-create-service-principal-portal#permissions-required-for-registering-an-app) section of [Use the portal to create a Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).

1. Sign in to your Azure account through the [Azure portal](https://portal.azure.com/).
1. Select **Microsoft Entra ID**.
1. Select **App registrations**.
1. Select **New registration**.
1. Name the application, for example "liberty-on-aro-app". Select a supported account type, which determines who can use the application. After setting the values, select **Register**, as shown in the following screenshot. It takes several seconds to provision the application. Wait for the deployment to complete before proceeding.

   :::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-create-service-principal.png" alt-text="Screenshot of Azure portal showing the Register an application page." lightbox="media/howto-deploy-java-liberty-app/azure-portal-create-service-principal.png":::

1. Save the Application (client) ID from the overview page, as shown in the following screenshot. Hover the pointer over the value (redacted in the screenshot) and select the copy icon that appears. The tooltip says **Copy to clipboard**. Be careful to copy the correct value, since the other values in that section also have copy icons. Save the Application ID to a file so you can use it later.

   :::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-obtain-service-principal-client-id.png" alt-text="Screenshot of Azure portal showing service principal client ID." lightbox="media/howto-deploy-java-liberty-app/azure-portal-obtain-service-principal-client-id.png":::

1. Create a new client secret by following these steps:

   1. Select **Certificates & secrets**.
   1. Select **Client secrets**, then **New client secret**.
   1. Provide a description of the secret and a duration. When you're done, select **Add**.
   1. After the client secret is added, the value of the client secret is displayed. Copy this value because you can't retrieve it later.

You now have a Microsoft Entra application, service principal, and client secret.

## Deploy IBM WebSphere Liberty or Open Liberty on Azure Red Hat OpenShift

The steps in this section direct you to deploy IBM WebSphere Liberty or Open Liberty on Azure Red Hat OpenShift.

The following steps show you how to find the offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *Liberty*. In the autosuggested search results, in the **Marketplace** section, select **IBM Liberty on ARO**, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-liberty-app/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift in search results." lightbox="media/howto-deploy-java-liberty-app/marketplace-search-results.png":::

   You can also go directly to the offer with this [portal link](https://aka.ms/liberty-aro).

1. On the offer page, select **Create**.

1. On the **Basics** pane, ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.

1. The offer must be deployed in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *abc1228rg*.

1. Create an environment variable in your shell for the resource group name.

   ```bash
   export RESOURCE_GROUP_NAME=<your-resource-group-name>
   ```

1. Under **Instance details**, select the region for the deployment. For a list of Azure regions where OpenShift operates, see [Regions for Red Hat OpenShift 4.x on Azure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=openshift&regions=all).

1. After selecting the region, select **Next**.

The following steps show you how to fill out the **ARO** pane shown in the following screenshot:

:::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-configure-cluster.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift ARO pane." lightbox="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-configure-cluster.png":::

1. Under **Create a new cluster**, select **Yes**.

1. Under **Provide information to create a new cluster**, for **Red Hat pull secret**, fill in the Red Hat pull secret that you obtained in the [Get a Red Hat pull secret](#get-a-red-hat-pull-secret) section. Use the same value for **Confirm secret**.

1. Fill in **Service principal client ID** with the service principal Application (client) ID that you obtained in the [Create a Microsoft Entra service principal from the Azure portal](#create-a-microsoft-entra-service-principal-from-the-azure-portal) section.

1. Fill in **Service principal client secret** with the service principal Application secret that you obtained in the [Create a Microsoft Entra service principal from the Azure portal](#create-a-microsoft-entra-service-principal-from-the-azure-portal) section. Use the same value for **Confirm secret**.

1. After filling in the values, select **Next**.

The following steps show you how to fill out the **Operator and application** pane shown in the following screenshot, and start the deployment.

:::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-operator-and-application.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift Operator and application pane." lightbox="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-operator-and-application.png":::

1. Under **IBM supported?**, select **Yes**.

   > [!NOTE]
   > This quickstart deploys the IBM-supported WebSphere Liberty Operator, but you can select **No** to deploy the Open Liberty Operator instead.

1. Leave the default option of **No** for **Deploy an application?**.

   > [!NOTE]
   > This quickstart manually deploys a sample application later, but you can select **Yes** for **Deploy an application?** if you prefer.

1. Select **Review + create**. Ensure that the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems and then select **Review + create** again.

1. Select **Create**.

1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment might take up to 40 minutes to complete.

## Verify the functionality of the deployment

The steps in this section show you how to verify that the deployment completed successfully.

If you navigated away from the **Deployment is in progress** page, the following steps show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5.

1. In the corner of any portal page, select the hamburger menu and then select **Resource groups**.

1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.

1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.

1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-deployments.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift deployments with the oldest deployment highlighted." lightbox="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-deployments.png":::

1. In the navigation pane, select **Outputs**. This list shows the output values from the deployment, which includes some useful information.

1. Open your terminal and paste the value from the **cmdToGetKubeadminCredentials** field. You see the admin account and credential for logging in to the OpenShift cluster console portal. The following content is an example of an admin account.

   ```bash
   az aro list-credentials --resource-group abc1228rg --name clusterf9e8b9
   {
     "kubeadminPassword": "xxxxx-xxxxx-xxxxx-xxxxx",
     "kubeadminUsername": "kubeadmin"
   }
   ```

1. Paste the value from the **clusterConsoleUrl** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>. Fill in the admin user name and password and sign in.

1. Verify that the appropriate Kubernetes operator for Liberty is installed. In the navigation pane, select **Operators**, then **Installed Operators**, as shown in the following screenshot:

   :::image type="content" source="media/howto-deploy-java-liberty-app/red-hat-openshift-cluster-console-portal.png" alt-text="Screenshot of Red Hat OpenShift cluster console portal showing Installed Operators page." lightbox="media/howto-deploy-java-liberty-app/red-hat-openshift-cluster-console-portal.png":::

   Take note if you installed the WebSphere Liberty operator or the Open Liberty operator. The operator variant matches what you selected at deployment time. If you selected **IBM Supported**, you have the WebSphere Liberty operator. Otherwise you have the Open Liberty operator. This information is important to know in later steps.

1. Download and install the OpenShift CLI `oc` by following steps in tutorial [Install the OpenShift CLI](tutorial-connect-cluster.md#install-the-openshift-cli), then return to this documentation.

1. Switch to **Outputs** pane, copy the value from the **cmdToLoginWithKubeadmin** field, and then paste it in your terminal. Run the command to sign in to the OpenShift cluster's API server. You should see output similar to the following example in the console:

   ```output
   Login successful.

   You have access to 71 projects, the list has been suppressed. You can list all projects with 'oc projects'

   Using project "default".
   ```

## Create an Azure SQL Database

The following steps guide you through creating an Azure SQL Database single database for use with your app:

1. Create a single database in Azure SQL Database by following the steps in [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart), carefully noting the differences described in the following note. Return to this article after creating and configuring the database server.

   > [!NOTE]
   > At the **Basics** step, write down the values for **Resource group**, **Database name**, **_\<server-name>_.database.windows.net**, **Server admin login**, and **Password**. The database **Resource group** is referred to as `<db-resource-group>` later in this article.
   >
   > At the **Networking** step, set **Connectivity method** to **Public endpoint**, **Allow Azure services and resources to access this server** to **Yes**, and **Add current client IP address** to **Yes**.
   >
   > :::image type="content" source="media/howto-deploy-java-liberty-app/create-sql-database-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking tab of the Create SQL Database page with the Connectivity method and Firewall rules settings highlighted." lightbox="media/howto-deploy-java-liberty-app/create-sql-database-networking.png":::

1. Create an environment variable in your shell for the resource group name for the database.

   ```bash
   export DB_RESOURCE_GROUP_NAME=<db-resource-group>
   ```

Now that you created the database and ARO cluster, you can prepare the ARO to host your WebSphere Liberty application.

## Configure and deploy the sample application

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven.

### Check out the application

Clone the sample code for this guide by using the following commands. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aro).

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aro.git
cd open-liberty-on-aro
export BASE_DIR=$PWD
git checkout 20240223
cd 3-integration/connect-db/mssql
```

If you see a message about being in "detached HEAD" state, this message is safe to ignore. It just means you checked out a tag.

There are a few samples in the repository. We use *3-integration/connect-db/mssql/*. Here's the file structure of the application:

```
mssql
├─ src/main/
│  ├─ aro/
│  │  ├─ db-secret.yaml
│  │  ├─ openlibertyapplication.yaml
│  │  ├─ webspherelibertyapplication.yaml
│  ├─ docker/
│  │  ├─ Dockerfile
│  │  ├─ Dockerfile-ol
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ pom.xml
```

The directories *java*, *resources*, and *webapp* contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the *aro* directory, there are three deployment files. *db-secret.xml* is used to create [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) with database connection credentials. The file *webspherelibertyapplication.yaml* is used in this quickstart to deploy the WebSphere Liberty Application. Use the file *openlibertyapplication.yaml* to deploy the Open Liberty Application if you deployed Open Liberty Operator in section [Deploy IBM WebSphere Liberty or Open Liberty on Azure Red Hat OpenShift](#deploy-ibm-websphere-liberty-or-open-liberty-on-azure-red-hat-openshift).

In the *docker* directory, there are two files to create the application image with either Open Liberty or WebSphere Liberty. These files are *Dockerfile* and *Dockerfile-ol*, respectively. You use the file *Dockerfile* to build the application image with WebSphere Liberty in this quickstart. Similarly, use the file *Dockerfile-ol* to build the application image with Open Liberty if you deployed Open Liberty Operator in section [Deploy IBM WebSphere Liberty or Open Liberty on Azure Red Hat OpenShift](#deploy-ibm-websphere-liberty-or-open-liberty-on-azure-red-hat-openshift).

In directory *liberty/config*, the *server.xml* file is used to configure the database connection for the Open Liberty and WebSphere Liberty cluster.

### Build the project

Now that you gathered the necessary properties, you can build the application by using the following commands. The POM file for the project reads many variables from the environment. As part of the Maven build, these variables are used to populate values in the YAML files located in *src/main/aro*. You can do something similar for your application outside Maven if you prefer.

```bash
cd ${BASE_DIR}/3-integration/connect-db/mssql

# The following variables are used for deployment file generation into target.
export DB_SERVER_NAME=<server-name>.database.windows.net
export DB_NAME=<database-name>
export DB_USER=<server-admin-login>@<server-name>
export DB_PASSWORD=<server-admin-password>

mvn clean install
```

### (Optional) Test your project locally

You can now run and test the project locally before deploying to Azure by using the following steps. For convenience, we use the `liberty-maven-plugin`. To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html). For your application, you can do something similar using any other mechanism, such as your local IDE. You can also consider using the `liberty:devc` option intended for development with containers. You can read more about `liberty:devc` in the [Liberty docs](https://openliberty.io/docs/latest/development-mode.html#_container_support_for_dev_mode).

1. Start the application by using `liberty:run`, as shown in the following example. `liberty:run` also uses the environment variables defined in the previous section.

   ```bash
   cd ${BASE_DIR}/3-integration/connect-db/mssql
   mvn liberty:run
   ```

1. Verify that the application works as expected. You should see a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds.` in the command output if successful. Go to `http://localhost:9080/` or `https://localhost:9443/` in your browser and verify the application is accessible and all functions are working.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

Next, use the following steps to containerize your project using Docker and run it as a container locally before deploying to Azure:

1. Use the following commands to build the image:

   ```bash
   cd ${BASE_DIR}/3-integration/connect-db/mssql/target
   docker buildx build --platform linux/amd64 -t javaee-cafe:v1 --pull --file=Dockerfile .
   ```

1. Run the image using the following command. Note we're using the environment variables defined previously.

   ```bash
   docker run -it --rm -p 9080:9080 -p 9443:9443 \
       -e DB_SERVER_NAME=${DB_SERVER_NAME} \
       -e DB_NAME=${DB_NAME} \
       -e DB_USER=${DB_USER} \
       -e DB_PASSWORD=${DB_PASSWORD} \
       javaee-cafe:v1
   ```

1. Once the container starts, go to `http://localhost:9080/` or `https://localhost:9443/` in your browser to access the application.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Build image and push to the image stream

When you're satisfied with the state of the application, you build the image remotely on the cluster by using the following steps.

1. Use the following commands to identity the source directory and the Dockerfile:

   ```bash
   cd ${BASE_DIR}/3-integration/connect-db/mssql/target

   # If you are deploying the application with WebSphere Liberty Operator, the existing Dockerfile is ready for you

   # If you are deploying the application with Open Liberty Operator, uncomment and execute the following two commands to rename Dockerfile-ol to Dockerfile
   # mv Dockerfile Dockerfile.backup
   # mv Dockerfile-ol Dockerfile
   ```

1. Use the following command to create an image stream:

   ```bash
   oc create imagestream javaee-cafe
   ```

1. Use the following command to create a build configuration that specifies the image stream tag of the build output:

   ```bash
   oc new-build --name javaee-cafe-config --binary --strategy docker --to javaee-cafe:v1
   ```

1. Use the following command to start the build to upload local contents, containerize, and output to the image stream tag specified before:

   ```bash
   oc start-build javaee-cafe-config --from-dir . --follow
   ```

### Deploy and test the application

Use the following steps to deploy and test the application:

1. Use the following command to apply the database secret:

   ```bash
   cd ${BASE_DIR}/3-integration/connect-db/mssql/target
   oc apply -f db-secret.yaml
   ```

   You should see the output `secret/db-secret-mssql created`.

1. Use the following command to apply the deployment file:

   ```bash
   oc apply -f webspherelibertyapplication.yaml
   ```

1. Wait until all pods are started and running successfully by using the following command:

   ```bash
   oc get pods -l app.kubernetes.io/name=javaee-cafe --watch
   ```

   You should see output similar to the following example to indicate that all the pods are running:

   ```output
   NAME                          READY   STATUS    RESTARTS   AGE
   javaee-cafe-67cdc95bc-2j2gr   1/1     Running   0          29s
   javaee-cafe-67cdc95bc-fgtt8   1/1     Running   0          29s
   javaee-cafe-67cdc95bc-h47qm   1/1     Running   0          29s
   ```

1. Use the following steps to verify the results:

   1. Use the following command to get the *host* of the Route resource deployed with the application:

      ```bash
      echo "route host: https://$(oc get route javaee-cafe --template='{{ .spec.host }}')"
      ```

   1. Copy the value of `route host` from the output, open it in your browser, and test the application. If the web page doesn't render correctly, that's because the app is still starting in the background. Wait for a few minutes and then try again.

   1. Add and delete a few coffees to verify the functionality of the app and the database connection.

      :::image type="content" source="media/howto-deploy-java-liberty-app/cafe-app-running.png" alt-text="Screenshot of the running app." lightbox="media/howto-deploy-java-liberty-app/cafe-app-running.png":::

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, ARO cluster, Azure SQL Database, and all related resources.

```bash
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $DB_RESOURCE_GROUP_NAME --yes --no-wait
```

## Next steps

Learn more about deploying IBM WebSphere family on Azure by following these links:

> [!div class="nextstepaction"]
> [What are solutions to run the IBM WebSphere family of products on Azure?](/azure/developer/java/ee/websphere-family?toc=/azure/openshift/toc.json&bc=/azure/openshift/breadcrumb/toc.json)
