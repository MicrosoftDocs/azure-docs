<properties
pageTitle="Use data from an on-premises SQL server in Machine Learning | Azure"
description="Use data from an on-premises SQL server to perform advanced analytics with Azure Machine Learning."
services="machine-learning"
documentationCenter=""
authors="garyericson"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="machine-learning"
ms.workload="data-services"
ms.tgt_pltfrm="na"
ms.devlang="na"
ms.topic="article"
ms.date="05/24/2016"
ms.author="garye;krishnan"/>

# Perform advanced analytics with Azure Machine Learning using data from an on-premises SQL server


Often enterprises would like to utilize the scale and agility of the
cloud for Machine Learning workloads, but without disrupting their
current business processes and workflows. Azure Machine Learning now
supports reading your data from an on-premises SQL server and then
training and scoring a model with this data. You no longer have to
manually copy and sync the data between the cloud and your on-premises
SQL server. Instead, the **Import Data** module in Azure Machine
Learning Studio reads directly from your on-premises SQL server for your
training and scoring jobs.

This article provides an overview of how to ingress on-premises SQL
server data into Azure Machine Learning. It assumes that you're familiar
with Azure Machine Learning concepts like workspaces, modules, datasets,
experiments, *etc*..

>[AZURE.NOTE] This feature is not available for free workspaces. For more
information about Machine Learning pricing and tiers, see [Azure Machine
Learning
Pricing](https://azure.microsoft.com/pricing/details/machine-learning/).
</br>

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]


## Install the Microsoft Data Management Gateway

To access an on-premises SQL server in Azure Machine Learning you need
to download and install the Microsoft Data Management Gateway. You can
do this ahead of time, or you can wait until you configure the gateway
connection in Machine Learning Studio (you will have the opportunity to
download and install the gateway using the **Download and register data
gateway** dialog described below).

You can find detailed information on installation prerequisites,
installation steps, and troubleshooting tips in the beginning sections
of the article [Move data between on-premises sources and cloud with
Data Management
Gateway](../data-factory/data-factory-move-data-between-onprem-and-cloud.md).

## <span id="using-the-data-gateway-step-by-step-walk" class="anchor"><span id="_Toc450838866" class="anchor"></span></span>Ingress data from your on-premises SQL server database into Azure Machine Learning


In this walkthrough, you will set up a Data Management Gateway in an Azure
Machine Learning workspace, configure it, and then read data from an
on-premises SQL Server database.

> [AZURE.TIP] Before you start, disable your browser’s pop-up blocker for
`studio.azureml.net`. If you're using the Google Chrome browser, download
and install one of the several plug-ins available at Google Chrome
WebStore [Click Once App
Extension](https://chrome.google.com/webstore/search/clickonce?_category=extensions).

### Step 1: Create a gateway

The first step is to create and set up the gateway to access your
on-premises SQL database.

1.  Login to [Azure Machine Learning
    Studio](https://studio.azureml.net/Home/) and select the workspace
    that you want to work in.

2.  Click the **SETTINGS** blade on the left, and then click the **DATA
    GATEWAYS** tab at the top.

3.  Click **NEW DATA GATEWAY** at the bottom of the screen.

    ![](media/machine-learning-use-data-from-an-on-premises-sql-server/new-data-gateway-button.png)

4.  In the **New data gateway** dialog, enter the **Gateway Name** and
    optionally add a **Description**. Click the arrow on the bottom
    right hand corner to go to the next step of the configuration.

    ![](media/machine-learning-use-data-from-an-on-premises-sql-server/new-data-gateway-dialog-enter-name.png)

5.  In the Download and register data gateway dialog, copy the GATEWAY
    REGISTRATION KEY to the clipboard.

    ![](media/machine-learning-use-data-from-an-on-premises-sql-server/download-and-register-data-gateway.png)

6.  <span id="note-1" class="anchor"></span>If you have not yet
    downloaded and installed the Microsoft Data Management Gateway, then
    click **Download data management gateway**. This takes you to the
    Microsoft Download Center where you can select the gateway version
    you need, download it, and install it. You can find detailed information on installation prerequisites, installation steps, and troubleshooting tips in the beginning sections of the article [Move data between on-premises sources and cloud with Data Management Gateway](../data-factory/data-factory-move-data-between-onprem-and-cloud.md).

7.  After the gateway is installed, the Data Management Gateway
    Configuration Manager will open and the **Register gateway** dialog
    is displayed. Paste the **Gateway Registration Key** that you copied
    to the clipboard and click **Register**.

8.  If you already have a gateway installed, run the Data Management
    Gateway Configuration Manager, click **Change key**, paste the
    **Gateway Registration Key** that you copied to the clipboard, and
    click **OK**.

9.  When the installation is complete, the **Register gateway** dialog
    for Microsoft Data Management Gateway Configuration Manager
    is displayed. Paste the GATEWAY REGISTRATION KEY that you copied to
    the clipboard above and click **Register**.

    ![](media/machine-learning-use-data-from-an-on-premises-sql-server/data-gateway-configuration-manager-register-gateway.png)

10.  The gateway configuration is complete when the following values are
    set on the **Home** tab in Microsoft Data Management Gateway
    Configuration Manager:

    -   **Gateway name** and **Instance name** are set to the name of
        the gateway.

    -   **Registration** is set to **Registered**.

    -   **Status** is set to **Started**.

    -   The status bar the bottom displays **Connected to Data
        Management Gateway Cloud Service** along with a green
        check mark.

    ![](media/machine-learning-use-data-from-an-on-premises-sql-server/data-gateway-configuration-manager-registered.png)

    Azure Machine Learning Studio also gets updated when the registration is successful.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\gateway-registered.png)

11.  In the **Download and register data gateway** dialog, click the
    check mark to complete the setup. The **Settings** page displays the
    gateway status as "Online". In the right hand pane you'll find
    status and other useful information.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\gateway-status.png)

12. In the Microsoft Data Management Gateway Configuration Manager
    switch to the **Certificate** tab. The certificate specified on this
    tab is used to encrypt/decrypt credentials for the on-premises data
    store that you specify in the portal. This is the default
    certificate generated. Microsoft recommends changing this to your
    own certificate that you back up in your certificate
    management system. Click **Change** to use your own
    certificate instead.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\data-gateway-configuration-manager-certificate.png)

13. (optional) If you want to enable verbose logging in order to
    troubleshoot issues with the gateway, in the Microsoft Data
    Management Gateway Configuration Manager switch to the
    **Diagnostics** tab and check the **Enable verbose logging for
    troubleshooting purposes** option. The logging information can be
    found in the Windows Event Viewer under the **Applications and
    Services Logs** -&gt; **Data Management Gateway** node. You can also
    use the **Diagnostics** tab to test the connection to an on-premises
    data source using the gateway.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\data-gateway-configuration-manager-verbose-logging.png)

This completes the gateway set up process in Azure Machine Learning.
You're now ready to use your on-premises data.

You can create and set up multiple gateways in Studio for each
workspace. For example, you may have a gateway that you want to connect
to your test data sources during development, and a different gateway
for your production data sources. Azure Machine Learning gives you the
flexibility to set up multiple gateways depending upon your corporate
environment. Currently you can’t share a gateway between workspaces and
only one gateway can be installed on a single computer. For more
considerations when installing the gateway, see [Considerations for
using Data Management
Gateway](../data-factory/data-factory-move-data-between-onprem-and-cloud.md#considerations-for-using-data-management-gateway)
in the article, [Move data between on-premises sources and cloud with
Data Management
Gateway](../data-factory/data-factory-move-data-between-onprem-and-cloud.md).

### Step 2: Use the gateway to read data from an on-premises data source

After you set up the gateway, you can add an **Import Data** module to
an experiment that inputs the data from the on-premises SQL server.

1.  In Machine Learning Studio, select the **EXPERIMENTS** tab, click
    **+NEW** in the lower-left corner, and select **Blank Experiment**
    (or select one of several sample experiments available).

2.  Find and drag the **Import Data** module to the experiment canvas.

3.  Click **Save as** below the canvas. Enter "Azure Machine Learning
    On-Premises SQL Server Tutorial" for the experiment name, select the
    workspace, and click the **OK** check mark.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\experiment-save-as.png)

4.  Click the **Import Data** module to select it, then in the
    **Properties** pane to the right of the canvas, select "On-Premises
    SQL Database" in the **Data source** dropdown list.

5.  Select the **Data gateway** you installed and registered. You can
    setup another gateway by selecting "(add new Data Gateway…)".

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\import-data-select-on-premises-data-source.png)

6.  Enter the SQL **Database server name** and **Database name**, along
    with the SQL **Database query** you want to execute.

7.  Click **Enter values** under **User name and password** and enter
    your database credentials. You can use Windows Integrated
    Authentication or SQL Server Authentication depending upon how your
    on-premises SQL server is configured.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\database-credentials.png)
    
    The message "values required" will change to "values set" with a green check mark. You just need to enter the credentials once unless the database information or password changes. Azure Machine Learning uses the certificate you provided when you installed the gateway to encrypt the credentials in the cloud. Azure will never store on-premises credentials without encryption.

    ![](media\machine-learning-use-data-from-an-on-premises-sql-server\import-data-properties-entered.png)

8.  Click **RUN** to run the experiment.

Once the experiment finishes running you can visualize the data you
imported from the database by clicking the output port of the **Import
Data** module and selecting **Visualize**.

Once you finish developing your experiment, you can deploy and
operationalize your model. Using the Batch Execution Service, data from
the on-premises SQL server configured in the **Import Data** module will
be read and used for scoring. While you can use the Request Response
Service for scoring on-premises data, Microsoft recommends using the
[Excel Add-in](machine-learning-excel-add-in-for-web-services.md)
instead. Currently, writing to an on-premises SQL server through
**Export Data** is not supported either in your experiments or published
web services.

