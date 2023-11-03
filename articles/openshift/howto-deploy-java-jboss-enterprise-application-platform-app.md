---
title: "Quickstart: Red Hat JBoss EAP on Azure Red Hat OpenShift"
description: Shows you how to quickly stand up Red Hat JBoss EAP on Azure Red Hat OpenShift.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 05/09/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-aro, devx-track-azurecli
---

# Quickstart: Deploy JBoss EAP on Azure Red Hat OpenShift using the Azure portal

This article shows you how to quickly stand up JBoss EAP on Azure Red Hat OpenShift using the Azure portal.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- A Red Hat account with complete profile. If you don't have one, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register).

- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the Bash environment. Be sure the Azure CLI version is 2.43.0 or higher.

  [![Image of button to launch Cloud Shell in a new window.](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  > [!NOTE]
  > You can also execute this guidance from a local developer command line with the Azure CLI installed. To learn how to install the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role and the [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

> [!NOTE]
> Azure Red Hat OpenShift requires a minimum of 40 cores to create and run an OpenShift cluster. The default Azure resource quota for a new Azure subscription does not meet this requirement. To request an increase in your resource limit, see [Standard quota: Increase limits by VM series](/azure/azure-portal/supportability/per-vm-quota-requests). Note that the free trial subscription isn't eligible for a quota increase, [upgrade to a Pay-As-You-Go subscription](/azure/cost-management-billing/manage/upgrade-azure-subscription) before requesting a quota increase.

## Get a Red Hat pull secret

The Azure Marketplace offer you use in this article requires a Red Hat pull secret. This section shows you how to get a Red Hat pull secret for Azure Red Hat OpenShift. To learn about what a Red Hat pull secret is and why you need it, see the [Get a Red Hat pull secret](/azure/openshift/tutorial-create-cluster#get-a-red-hat-pull-secret-optional) section in [Tutorial: Create an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-create-cluster).

Use the following steps to get the pull secret.

1. Open the [Red Hat OpenShift Hybrid Cloud Console](https://console.redhat.com/openshift/install/azure/aro-provisioned), then use your Red Hat account to sign in to the OpenShift cluster manager portal. You may need to accept more terms and update your account as shown in the following screenshot. Use the same password as when you created the account.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/red-hat-account-complete-profile.png" alt-text="Screenshot of Red Hat Update Your Account page." lightbox="media/howto-deploy-java-enterprise-application-platform-app/red-hat-account-complete-profile.png":::

1. After you sign in, select **OpenShift** then **Downloads**.
1. Select the **All categories** dropdown list and then select **Tokens**.
1. Under **Pull secret**, select **Copy** or **Download** to get the value, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/red-hat-console-portal-pull-secret.png" alt-text="Screenshot of Red Hat console portal showing the pull secret." lightbox="media/howto-deploy-java-enterprise-application-platform-app/red-hat-console-portal-pull-secret.png":::

   The following content is an example that was copied from the Red Hat console portal, with the auth codes replaced with `xxxx...xxx`.

   ```json
   {"auths":{"cloud.openshift.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"quay.io":{"auth":"xxx...xxx","email":"contoso-user@test.com"},"registry.connect.redhat.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"registry.redhat.io":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"}}}
   ```

1. Save the secret to a file so you can use it later.

<a name='create-an-azure-active-directory-service-principal-from-the-azure-portal'></a>

## Create a Microsoft Entra service principal from the Azure portal

The Azure Marketplace offer used in this article requires a Microsoft Entra service principal to deploy your Azure Red Hat OpenShift cluster. The offer assigns the service principal with proper privileges during deployment time, with no role assignment needed. If you have a service principal ready to use, skip this section and move on to the next section, where you create a Red Hat Container Registry service account.

Use the following steps to deploy a service principal and get its Application (client) ID and secret from the Azure portal. For more information, see [Create and use a service principal to deploy an Azure Red Hat OpenShift cluster](/azure/openshift/howto-create-service-principal?pivots=aro-azureportal).

> [!NOTE]
> You must have sufficient permissions to register an application with your Microsoft Entra tenant. If you run into a problem, check the required permissions to make sure your account can create the identity. For more information, see the [Permissions required for registering an app](/azure/active-directory/develop/howto-create-service-principal-portal#permissions-required-for-registering-an-app) section of [Use the portal to create a Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).

1. Sign in to your Azure account through the [Azure portal](https://portal.azure.com/).
1. Select **Microsoft Entra ID**.
1. Select **App registrations**.
1. Select **New registration**.
1. Name the application - for example, `jboss-eap-on-aro-app`. Select a supported account type, which determines who can use the application. After setting the values, select **Register**, as shown in the following screenshot. It takes several seconds to provision the application. Wait for the deployment to complete before proceeding.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/create-service-principal.png" alt-text="Screenshot of Azure portal showing the Register an application page." lightbox="media/howto-deploy-java-enterprise-application-platform-app/create-service-principal.png":::

1. Save the Application (client) ID from the overview page, as shown in the following screenshot. Hover the pointer over the value, which is redacted in the screenshot, and select the copy icon that appears. The tooltip says **Copy to clipboard**. Be careful to copy the correct value, since the other values in that section also have copy icons. Save the Application ID to a file so you can use it later.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/obtain-service-principal-client-id.png" alt-text="Screenshot of Azure portal showing service principal client ID." lightbox="media/howto-deploy-java-enterprise-application-platform-app/obtain-service-principal-client-id.png":::

1. Create a new client secret by following these steps:

   1. Select **Certificates & secrets**.
   1. Select **Client secrets**, then **New client secret**.
   1. Provide a description of the secret and a duration. When you're done, select **Add**.
   1. After the client secret is added, the value of the client secret is displayed. Copy this value because you can't retrieve it later. Be sure to copy the **Value** and not the **Secret ID**.

You've now created your Microsoft Entra application, service principal, and client secret.

## Create a Red Hat Container Registry service account

Later, this article shows you how to manually deploy an application to OpenShift using Source-to-Image (S2I). A Red Hat Container Registry service account is necessary to pull the container image for JBoss EAP on which to run your application. If you have a Red Hat Container Registry service account ready to use, skip this section and move on to the next section, where you deploy the offer.

Use the following steps to create a Red Hat Container Registry service account and get its username and password. For more information, see [Creating Registry Service Accounts](https://access.redhat.com/RegistryAuthentication#creating-registry-service-accounts-6) in the Red Hat documentation.

1. Use your Red Hat account to sign in to the [Registry Service Account Management Application](https://access.redhat.com/terms-based-registry/).
1. From the **Registry Service Accounts** page, select **New Service Account**.
1. Provide a name for the Service Account. The name is prepended with a fixed, random string.
   - Enter a description.
   - Select **create**.
1. Navigate back to your Service Accounts.
1. Select the Service Account you created.
   - Note down the **username**, including the prepended string (that is, `XXXXXXX|username`). Use this username when you sign in to `registry.redhat.io`.
   - Note down the **password**. Use this password when you sign in to `registry.redhat.io`.

You've now created your Red Hat Container Registry service account.

## Deploy JBoss EAP on Azure Red Hat OpenShift

The steps in this section direct you to deploy JBoss EAP on Azure Red Hat OpenShift.

The following steps show you how to find the offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *JBoss EAP*. In the search results, in the **Marketplace** section, select **JBoss EAP on Azure Red Hat OpenShift**, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift in search results." lightbox="media/howto-deploy-java-enterprise-application-platform-app/marketplace-search-results.png":::

   You can also go directly to the [JBoss EAP on Azure Red Hat OpenShift offer](https://aka.ms/eap-aro-portal) on the Azure portal.

1. On the offer page, select **Create**.

1. On the **Basics** pane, ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.

1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *eaparo033123rg*.

1. Under **Instance details**, select the region for the deployment. For a list of Azure regions where OpenShift operates, see [Regions for Red Hat OpenShift 4.x on Azure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=openshift&regions=all).

1. Select **Next: ARO**.

The following steps show you how to fill out the **ARO** pane shown in the following screenshot:

:::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/configure-cluster.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift ARO pane." lightbox="media/howto-deploy-java-enterprise-application-platform-app/configure-cluster.png":::

1. Under **Create a new cluster**, select **Yes**.

1. Under **Provide information to create a new cluster**, for **Red Hat pull secret**, fill in the Red Hat pull secret that you obtained in the [Get a Red Hat pull secret](#get-a-red-hat-pull-secret) section. Use the same value for **Confirm secret**.

1. Fill in **Service principal client ID** with the service principal Application (client) ID that you obtained in the [Create a Microsoft Entra service principal from the Azure portal](#create-an-azure-active-directory-service-principal-from-the-azure-portal) section.

1. Fill in **Service principal client secret** with the service principal Application secret that you obtained in the [Create a Microsoft Entra service principal from the Azure portal](#create-an-azure-active-directory-service-principal-from-the-azure-portal) section. Use the same value for **Confirm secret**.

1. Select **Next EAP Application**.

The following steps show you how to fill out the **EAP Application** pane shown in the following screenshot, and then start the deployment.

:::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/eap-application.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift EAP Application pane." lightbox="media/howto-deploy-java-enterprise-application-platform-app/eap-application.png":::

1. Leave the default option of **No** for **Deploy an application to OpenShift using Source-to-Image (S2I)?**.

   > [!NOTE]
   > Later, this quickstart shows you how to manually deploy an application with a database connection.

1. Select **Next: Review + create**.

1. Select **Review + create**. Ensure that the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems, and then select **Review + create** again.

1. Select **Create**.

1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 35 minutes to complete.

While you wait, you can set up the database.

## Set up Azure Database for MySQL - Flexible Server

The following sections show you how to set up Azure Database for MySQL - Flexible Server.

### Set environment variables in the Azure Cloud Shell

The application is a Jakarta EE application backed by a MySQL database, and is deployed to the OpenShift cluster using Source-to-Image (S2I). For more information about S2I, see the [S2I Documentation](http://red.ht/eap-aro-s2i).

Continuing in the Azure Cloud Shell, use the following command to set up some environment variables:

```azurecli-interactive
RG_NAME=<resource-group-name>
SERVER_NAME=<database-server-name>
DB_DATABASE_NAME=testdb
ADMIN_USERNAME=myadmin
ADMIN_PASSWORD=<mysql-admin-password>
DB_USERNAME=testuser
DB_PASSWORD=Secret123456
PROJECT_NAME=eaparo-sample
CON_REG_SECRET_NAME=eaparo-sample-pull-secret
CON_REG_ACC_USER_NAME="<red-hat-container-registry-service-account-username>"
CON_REG_ACC_PWD="<red-hat-container-registry-service-account-password>"
APPLICATION_NAME=javaee-cafe
APP_REPLICAS=3
```

Replace the placeholders with the following values, which are used throughout the remainder of the article:

- `<resource-group-name>`: The name of resource group you created previously - for example, `eaparo033123rg`.
- `<database-server-name>`: The name of your MySQL server, which should be unique across Azure - for example, `eaparo033123mysql`.
- `<mysql-admin-password>`: The admin password of your MySQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<red-hat-container-registry-service-account-username>` and `<red-hat-container-registry-service-account-password>`: The username and password of the Red Hat Container Registry service account you created before.

It's a good idea to save the fully filled out name/value pairs in a text file, in case the Azure Cloud Shell times out before you're done executing the commands. That way, you can paste them into a new instance of the Cloud Shell and easily continue.

These name/value pairs are essentially "secrets". For a production-ready way to secure Azure Red Hat OpenShift, including secret management, see [Security for the Azure Red Hat OpenShift landing zone accelerator](/azure/cloud-adoption-framework/scenarios/app-platform/azure-red-hat-openshift/security).

### Create and initialize the database

Next, use the following steps to create an Azure Database for MySQL - Flexible Server, and create a user with permissions to read/write from/to the specific database.

1. Use the following command to create an Azure Database for MySQL - Flexible Server:

   ```azurecli-interactive
   az mysql flexible-server create \
       --resource-group ${RG_NAME} \
       --name ${SERVER_NAME} \
       --database-name ${DB_DATABASE_NAME} \
       --public-access 0.0.0.0  \
       --admin-user ${ADMIN_USERNAME} \
       --admin-password ${ADMIN_PASSWORD} \
       --yes
   ```

   This command may take ten or more minutes to complete. When the command successfully completes, you see output similar to the following example:

   ```output
   {
     "connectionString": "mysql testdb --host ejb010406adb.mysql.database.azure.com --user myadmin --password=Secret#123345",
     "databaseName": "testdb",
     "firewallName": "AllowAllAzureServicesAndResourcesWithinAzureIps_2023-4-6_21-21-3",
     "host": "ejb010406adb.mysql.database.azure.com",
     "id": "/subscriptions/redacted/resourceGroups/ejb010406a/providers/Microsoft.DBforMySQL/flexibleServers/ejb010406adb",
     "location": "East US",
     "password": "Secret#123345",
     "resourceGroup": "ejb010406a",
     "skuname": "Standard_B1ms",
     "username": "myadmin",
     "version": "5.7"
   }
   ```

1. Use the following commands to get the host of the created MySQL server:

   ```azurecli-interactive
   DB_HOST=$(az mysql flexible-server show \
       --resource-group ${RG_NAME} \
       --name ${SERVER_NAME} \
       --query "fullyQualifiedDomainName" \
       --output tsv)
   echo $DB_HOST
   ```

   Save the name/value pair to your text file.

1. Use the following command to create a temporary firewall rule to allow connection to the MySQL server from the public internet:

   ```azurecli-interactive
   az mysql flexible-server firewall-rule create \
       --resource-group ${RG_NAME} \
       --name ${SERVER_NAME} \
       --rule-name "AllowAllIPs" \
       --start-ip-address 0.0.0.0 \
       --end-ip-address 255.255.255.255
   ```

1. Use the following command to create a new database user with permissions to read and write the specific database. This command is useful to send SQL directly to the database.

   ```azurecli-interactive
   mysql --host ${DB_HOST} --user ${ADMIN_USERNAME} --password=${ADMIN_PASSWORD} << EOF
   CREATE USER '${DB_USERNAME}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
   GRANT ALL PRIVILEGES ON ${DB_DATABASE_NAME} . * TO '${DB_USERNAME}'@'%';
   FLUSH PRIVILEGES;
   EOF
   ```

1. Use the following command to delete the temporary firewall rule:

   ```azurecli-interactive
   az mysql flexible-server firewall-rule delete \
       --resource-group ${RG_NAME} \
       --name ${SERVER_NAME}  \
       --rule-name "AllowAllIPs" \
       --yes
   ```

You now have a MySQL database server running and ready to connect with your app.

## Verify the functionality of the deployment

The steps in this section show you how to verify that the deployment has successfully completed.

If you navigated away from the **Deployment is in progress** page, the following steps show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5.

1. In the corner of any Azure portal page, select the hamburger menu and then select **Resource groups**.

1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.

1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.

1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/deployments.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift deployments with the oldest deployment highlighted." lightbox="media/howto-deploy-java-enterprise-application-platform-app/deployments.png":::

1. In the navigation pane, select **Outputs**. This list shows the output values from the deployment, which includes some useful information.

1. Open Azure Cloud Shell, paste the value from the **cmdToGetKubeadminCredentials** field, and execute it. You see the admin account and credential for signing in to the OpenShift cluster console portal. The following example shows an admin account:

   ```azurecli
   az aro list-credentials --resource-group eaparo033123rg --name clusterf9e8b9
   ```

   This command produces output similar to the following example:

   ```output
   {
     "kubeadminPassword": "xxxxx-xxxxx-xxxxx-xxxxx",
     "kubeadminUsername": "kubeadmin"
   }
   ```

1. Paste the value from the **consoleUrl** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>. Fill in the admin user name and password, then select **Log in**. In the admin console of Azure Red Hat OpenShift, select **Operators** > **Installed Operators**, where you can find that the **JBoss EAP** operator is successfully installed, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/red-hat-openshift-cluster-console-portal-operators.png" alt-text="Screenshot of Red Hat OpenShift cluster console portal showing Installed operators page." lightbox="media/howto-deploy-java-enterprise-application-platform-app/red-hat-openshift-cluster-console-portal-operators.png":::

Next, use the following steps to connect to the OpenShift cluster using the OpenShift CLI:

1. In the Azure Cloud Shell, use the following commands to download the latest OpenShift 4 CLI for GNU/Linux.  If running on an OS other than GNU/Linux, download the appropriate binary for that OS.

   ```azurecli-interactive
   cd ~
   wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz

   mkdir openshift
   tar -zxvf openshift-client-linux.tar.gz -C openshift
   echo 'export PATH=$PATH:~/openshift' >> ~/.bashrc && source ~/.bashrc
   ```

1. Paste the value from the **cmdToLoginWithKubeadmin** field into the Azure Cloud Shell, and execute it. You should see the `login successful` message and the project you're using. The following content is an example of the command to connect to the OpenShift cluster using the OpenShift CLI.

   ```azurecli-interactive
   oc login \
       $(az aro show \
           --resource-group eaparo033123rg \
           --name aro-cluster \
           --query apiserverProfile.url \
           --output tsv) \
       -u $(az aro list-credentials \
           --resource-group eaparo033123rg \
           --name aro-cluster \
           --query kubeadminUsername \
           --output tsv) \
       -p $(az aro list-credentials \
           --resource-group eaparo033123rg \
           --name aro-cluster \
           --query kubeadminPassword \
           --output tsv)

   This command produces output similar to the following example:

   ```output
   Login successful.

   You have access to 68 projects, the list has been suppressed. You can list all projects with 'oc projects'

   Using project "default".
   ```

## Deploy a JBoss EAP app to the OpenShift cluster

The steps in this section show you how to deploy an app on the cluster.

### Deploy the app to the cluster

Use the following steps to deploy the app to the cluster. The app is hosted in the GitHub repo [rhel-jboss-templates/eap-coffee-app](https://github.com/Azure/rhel-jboss-templates/tree/main/eap-coffee-app).

1. In the Azure Cloud Shell, run the following commands to create a project, apply a permission to enable S2I to work, image the pull secret, and link the secret to the relative service accounts in the project for image pulling. Disregard the git warning about "'detached HEAD' state".

   ```azurecli-interactive
   git clone https://github.com/Azure/rhel-jboss-templates.git
   cd rhel-jboss-templates
   git checkout 20230615
   cd ..
   oc new-project ${PROJECT_NAME}
   oc adm policy add-scc-to-user privileged -z default --namespace ${PROJECT_NAME}
   w0=-w0
   if [[ $OSTYPE == 'darwin'* ]]; then
     w0=
   fi

   CON_REG_ACC_USER_NAME_BASE64=$(echo ${CON_REG_ACC_USER_NAME} | base64 $w0)
   CON_REG_ACC_PWD_BASE64=$(echo ${CON_REG_ACC_PWD} | base64 $w0)
   ```

   Because the next section uses HEREDOC format, it's best to include and execute it in its own code excerpt.

   ```azurecli-interactive

   cat <<EOF | oc apply -f -
   apiVersion: v1
   kind: Secret
   metadata:
     name: ${CON_REG_SECRET_NAME}
   type: Opaque
   data:
     username: ${CON_REG_ACC_USER_NAME_BASE64}
     password: ${CON_REG_ACC_PWD_BASE64}
   stringData:
     hostname: registry.redhat.io
   EOF
   ```

   You must see `secret/eaparo-sample-pull-secret created` to indicate successful creation of the secret. If you don't see this output, troubleshoot and resolve the problem before proceeding. Finally, link the secret.

   ```azurecli-interactive
   oc secrets link default ${CON_REG_SECRET_NAME} --for=pull
   oc secrets link builder ${CON_REG_SECRET_NAME} --for=pull
   ```

1. Use the following commands to pull the image stream `jboss-eap74-openjdk11-openshift`. Then, start the source to image process and wait until it completes.

   ```azurecli-interactive
   oc apply -f https://raw.githubusercontent.com/jboss-container-images/jboss-eap-openshift-templates/eap74/eap74-openjdk11-image-stream.json
   oc new-build --name=${APPLICATION_NAME} --binary --image-stream=jboss-eap74-openjdk11-openshift:7.4.0 -e CUSTOM_INSTALL_DIRECTORIES=extensions
   oc start-build ${APPLICATION_NAME} --from-dir=rhel-jboss-templates/eap-coffee-app --follow
   ```

Successful output should end with something similar to the following example:

```output
Writing manifest to image destination
Storing signatures
Successfully pushed image-registry.openshift-image-registry.svc:5000/eaparo-sample/javaee-cafe@sha256:754587c33c03bf42ba4f3ce5a11526bbfc82aea94961ce1179a415c2bfa73449
Push successful
```

If you don't see similar output, troubleshoot and resolve the problem before proceeding.

### Create a secret for the database password

Next, use the following steps to create a secret:

1. Use the following command to create a secret for holding the password of the database:

   ```azurecli-interactive
   oc create secret generic db-secret --from-literal=password=${DB_PASSWORD}
   ```

1. Use the following commands to deploy and run three replicas of the containerized app in the cluster:

   ```azurecli-interactive
   cat <<EOF | oc apply -f -
   apiVersion: wildfly.org/v1alpha1
   kind: WildFlyServer
   metadata:
     name: ${APPLICATION_NAME}
   spec:
     applicationImage: ${APPLICATION_NAME}:latest
     replicas: ${APP_REPLICAS}
     env:
       - name: DB_SERVICE_PREFIX_MAPPING
         value: TEST-MYSQL=DS1
       - name: TEST_MYSQL_SERVICE_HOST
         value: ${DB_HOST}
       - name: TEST_MYSQL_SERVICE_PORT
         value: '3306'
       - name: DS1_JNDI
         value: java:jboss/datasources/JavaEECafeDB
       - name: DS1_URL
         value: jdbc:mysql://${DB_HOST}:3306/${DB_DATABASE_NAME}
       - name: DS1_DRIVER
         value: mysql
       - name: DS1_DATABASE
         value: ${DB_DATABASE_NAME}
       - name: DS1_USERNAME
         value: ${DB_USERNAME}
       - name: DS1_PASSWORD
         valueFrom:
           secretKeyRef:
             name: db-secret
             key: password
     secrets:
       - db-secret
   EOF
   ```

   If the command completed successfully, you should see `wildflyserver.wildfly.org/javaee-cafe created`.  If you don't see this output, troubleshoot and resolve the problem before proceeding.

1. Run `oc get pod -w | grep 1/1` to monitor whether all pods of the app are running. When you see output similar to the following example, press <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop the monitoring:

   ```output
   javaee-cafe-2         1/1     Running             0          31s
   javaee-cafe-1         1/1     Running             0          30s
   javaee-cafe-0         1/1     Running             0          30s
   ```

   It may take a few minutes to reach the proper state.

1. Run the following command to return the URL of the application. You can use this URL to access the deployed sample app. Copy the output to the clipboard.

   ```azurecli-interactive
   echo http://$(oc get route ${APPLICATION_NAME}-route -o=jsonpath='{.spec.host}')/javaee-cafe
   ```

1. Paste the output into an Internet-connected web browser, and then press <kbd>Enter</kbd>. You should see the UI of **Java EE Cafe** app similar to the following screenshot:

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/javaee-cafe-ui.png" alt-text="Screenshot of Java EE Cafe app UI." lightbox="media/howto-deploy-java-enterprise-application-platform-app/javaee-cafe-ui.png":::

## Clean up resources

If you're not going to continue to use the OpenShift cluster, navigate back to your working resource group. At the top of the page, under the text **Resource group**, select the resource group. Then, select **Delete resource group**.

## Next steps

Learn more about deploying JBoss EAP on Azure by following these links:

> [!div class="nextstepaction"]
> [Red Hat JBoss EAP on Azure](/azure/developer/java/ee/jboss-on-azure?toc=/azure/openshift/toc.json&bc=/azure/openshift/breadcrumb/toc.json)
