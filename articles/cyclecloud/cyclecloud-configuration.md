# Configuring Azure Credentials

## Cloud Provider
Once CycleCloud has been installed and configured, you will need to connect it with your Azure account.

To begin, click on **Clusters** in the top menu bar. A notice will appear that you currently do not have a cloud provider set up.

![No Accounts Found error](~/images/no_accounts_found.png)

Click the link to add your credentials.

## Configuration

You will need to configure your Azure account for CycleCloud by generating access credentials, configuring network settings, and enabling certain services. CycleCloud uses the credentials you provide to provision infrastructure.

![Create Cloud Provider Account window](~/images/create_azure.png)

Enter a descriptive name for your cloud provider setup, such as "My Azure Account". From the drop-down, select Microsoft Azure as the provider. Enter the Subscription ID, Tenant ID, Application ID, and Application Secret (all of which are provided when you create the Service Account in Azure).
Add the Storage Account and a Storage Container name to use for storing configuration and application data for your cluster. If it does not already exist, the container will be created.

If this Microsoft Azure account will be your main cloud provider for CycleCloud, check the "Set Default" option. Once you have completed setting the parameters for your Azure account, click **Save** to continue.

## Requirements

You will need the following:

- A Microsoft Azure account with an active subscription
- An Application Registration with Contributor access for the Subscription used with CycleCloud
- A Network Security Group set up to allow CycleCloud to communicate with Azure
- A [Virtual Network](https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-linux-quick-create-portal?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for CycleCloud

Azure uses a subscription ID and authentication certificate for account validation. You can download these in a .publishsettings format by logging into [this Azure service](https://windows.azure.com/download/publishprofile.aspx). This format easily integrates with CycleCloud.

### Creating the Azure Application Registration

1. Log into your [Azure Dashboard](https://portal.azure.com)
2. From the left menu, open **Azure Active Directory**
3. Click on **App Registrations**, then **+ New Application Registration**
4. Give your application a unique name (i.e. "MyAzureApplication")
5. Choose "Web App/API" as the Type
6. The Sign-on URL is a required field, but not used by CycleCloud. Enter ``http://localhost`` so the form will accept your request.
7. Click **Create**
8. Once your application has been created, click on it to load the app information. From here, click on **Settings**, then **Keys**.

    * Enter a descriptive name for your key, such as "MyCycleCloudKey"
    * Select a duration for your key to be valid: 1-year, 2-years, or Never Expires
    * Your key will not be displayed until it has been saved. Click the button at the top of the pane:

![Azure Key Generation screen](~/images/azure_key_gen.png)

> [!WARNING]
>You can only view this key once! If you leave this page, you will no longer be able to access the key, which is needed to configure CycleCloud as the "Application Secret". Copy it now and save it somewhere secure.

After you've saved your key, go back to the app information panel. From here, copy the **Application ID**. This will be used in CycleCloud, along with the key saved in the previous step.

### Assigning the Contributor Role

To give CycleCloud the required access to your Azure Application Registration, you will need to set the service account (application) you just created up as a Contributor. To change the Application Registration Role:

1. From the left menu, click on "Subscriptions" (or All Services - Subscriptions)
2. Click on the appropriate subscription
3. Select **Access Control (IAM)**

![Access Control screen](~/images/azure_iam.png)

4. Click **+ Add**. On the new panel that appears, click on **Contributor** to set the role.
5. In Step 2, search for "MyAzureApplication" and select the appropriate item. Click **Select**.

### Creating a Network Security Group

From your Azure Dashboard, click on **Network Security Groups**. If you don't see the option, click on **All Services** and search for or scroll down to **Network Security Groups**.

1. Click **+ Add**
2. Give your Network Security Group a unique name. Security groups are managed per region, so we suggest including the region you intend to run in.
3. Create a new Resource Group with a unique name
4. Click **Create**

In the dashboard, click on the name of the Network Security Group you just created. If you do not see it, click **Refresh**. In the new panel, click on **Inbound Security Rules** and add the following:

| Name    | Priority | Source | Service | Protocol | Port Range |
| ------- | -------- | ------ | ------- | -------- | ---------- |
| SSH     | 100      | Any    | Custom  | Any      | 22         |
| RDP     | 110      | Any    | Custom  | Any      | 3389       |
| Ganglia | 120      | Any    | Custom  | Any      | 8652       |

5. For each entry, **Allow** the action
6. Click **OK** to add the rule

![Azure Inbound Rule screen](~/images/azure_inbound_rule.png)

>[!Note]
>Should you wish to start a cluster that includes CycleServer (such as the standard Condor cluster), you may want to include the following rule for port 8443. Please note that this will require SSL configured with a valid domain and certificates.

| Name        | Priority | Source | Service | Protocol | Port Range |
| ----------- | -------- | ------ | ------- | -------- | ---------- |
| https_8443  | 150      | Any    | HTTPS   | TCP      | 8443       |

### Creating a Virtual Network

You will need to set up a Virtual Network within Azure to work with CycleCloud. From the main menu, click
on **Virtual Network**. If you don't see the option, click on **All Services** and either search for Virtual Networks or scroll down to the **Networking** section.

1. Click **+ Add**
2. Enter a unique name for your Virtual Network
3. Create a new Resource Group if you don't have one set up
4. The other default settings will suffice for this example
5. Select the Resource Group name you created in the previous step
6. Click **Create**

![Azure Virtual Network](~/images/azure_virtual_network.png)

Your Virtual Network requires a subnet, and your Network Security Group assigned to it:

- From the dashboard, click on the Virtual Network you just created
- Under "Settings", click on **Subnets**
- Click on the default subnet
- Click on the **Network Security Groups** header
- Select the group created earlier
- Click **OK**

### Information Location

The information you need from Microsoft Azure to get it working within CycleCloud can be a little difficult to locate. Here's a list of what you'll need, and where to find it:

- Application ID: Click on Dashboard - Azure Active Directory - App Registrations - the Application ID
- Application Secret: This is the secret key that you saved when creating your Application Registration
- Subscription ID: Dashboard - All Services - Subscriptions - Subscription - Subscription ID
- Tenant ID: This is the Directory ID. It is found under Azure Active Directory - Properties - Directory ID
