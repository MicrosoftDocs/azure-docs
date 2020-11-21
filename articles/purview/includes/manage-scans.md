---
author: hrasheed-msft
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: include
ms.date: 11/20/2020
ms.author: hrasheed
---
## Creating and running a scan

To create and run a new scan, do the following:

1. Navigate to the management center and select **Data sources** under the **Sources and scanning** section.

1. Select the data source that you registered.

1. Select **+ New scan**

1. Select the authentication method.

   1. **SQL authentication:** You will need database name, user name and password.

      :::image type="content" source="media/manage-scans/set-up-scan-using-sql-authentication.png" alt-text="Set up scan using SQL authentication":::

   1. **Service Principal:** Select Service Principal from the dropdown menu and provide database name service principal ID which is your **Application client (ID)** and service principal key which is your **client secret**.

      :::image type="content" source="media/manage-scans/set-up-scan-using-service-principal.png" alt-text="Set up scan using service principal":::

      > [!Note]
      > If Test connection fails, you need to go back to the **Prerequisites** step to confirm if the appropriate permission is assigned to the service principal. In addition, the server name must have port number to successfully connect.

   1. **Managed Identity:** You just need to select Managed Identity from the drop-down menu and test connection.

      :::image type="content" source="media/manage-scans/set-up-scan-using-managed-identity.png" alt-text="Set up scan using managed identity":::

    1. **Integration runtime:** for on-premises SQL servers, select your desired integration runtime, set the **Authentication method** to **Connection string**. Database name is optional, if you do not provide a name, the whole server will be scanned. Fill in the user name and password.

1. You can scope your scan to specific schemas by checking the appropriate items in the list.

   :::image type="content" source="media/manage-scans/scope-your-scan.png" alt-text="Scope your scan":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/manage-scans/trigger-scan.png" alt-text="trigger":::

1. The select a scan rule set for you scan. You can choose between the system default, the existing custom ones or create a new one inline.

   :::image type="content" source="media/manage-scans/scan-rule-set.png" alt-text="Scan rule set":::

1. Review your scan and select **Save and run**.

## Viewing your scans and scan runs

To view existing scans, do the following:

1. Navigate to the management center. Select **Data sources** under the **Sources and scanning** section. 

2. Select the desired data source. You will see a list of existing scans on that data source.

3. Select the scan whose results you are interested to view.

4. This page will show you all of the previous scan runs along with metrics and status for each scan run. It will also display whether your scan was scheduled or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan, and the total scan duration.

## Manage your scans - edit, delete, or cancel

To manage or delete a scan, do the following:

1. Navigate to the management center. Select **Data sources** under the **Sources and scanning** section then select on the desired data source.

2. Select the scan you would like to manage. You can edit the scan by selecting **Edit**.

   :::image type="content" source="media/manage-scans/edit-scan.png" alt-text="edit scan":::

3. You can delete your scan by selecting **Delete**. 
