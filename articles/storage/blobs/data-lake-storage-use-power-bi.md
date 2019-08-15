---
title: Analyze data in Azure Data Lake Storage Gen2 by using Power BI | Microsoft Docs
description: Use Power BI to analyze data stored in Azure Data Lake Storage Gen2
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: conceptual
ms.date: 07/18/2019
ms.author: normesta
ms.reviewer: bensack
---

# Analyze data in Azure Data Lake Storage Gen2 by using Power BI

In this article you'll learn how to use Power BI Desktop to analyze and visualize data that is stored in a storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2).

## Prerequisites

Before you begin this tutorial, you must have the following:

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has a hierarchical namespace. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.
> This article assumes that you've created an account named `myadlsg2`.
> * A sample data file named `Drivers.txt` located in your storage account.
> You can download this sample from [Azure Data Lake Git Repository](https://github.com/Azure/usql/tree/master/Examples/Samples/Data/AmbulanceDataDrivers.txt), and then upload that file to your storage account.
> * **Power BI Desktop**. You can download this from [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45331). 

## Create a report in Power BI Desktop

1. Launch Power BI Desktop on your computer.
2. From the **Home** tab of the Ribbon, click **Get Data**, and then click **More**.
3. In the **Get Data** dialog box, click **Azure**, click **Azure Data Lake Store Gen2 (Beta)**, and then click **Connect**.

    ![Get data page](media/data-lake-storage-use-power-bi/get-data-page.png)

4. In the **Azure Data Lake Storage Gen2** dialog box, you can provide the URL to your Azure Data Lake Storage Gen2 account, filesystem or subfolder using the file system endpoint format. URLs for Data Lake Storage Gen2 have the following pattern  `https://<accountname>.dfs.core.windows.net/<filesystemname>/<subfolder>` and then click **OK**.

    ![URL](media/data-lake-storage-use-power-bi/adls-url.png)

5. In the next dialog box, click **Sign in** to sign into your storage account. You'll be redirected to your organization's sign in page. Follow the prompts to sign into the account.

    ![Sign in page](media/data-lake-storage-use-power-bi/sign-in.png)

6. After you've successfully signed in, click **Connect**.

    ![Signed in page](media/data-lake-storage-use-power-bi/signed-in.png)

7. The next dialog box shows all files under the URL you provided in step 4 above including the file that you uploaded to your storage account. Verify the information, and then click **Load**.

    ![File systems](media/data-lake-storage-use-power-bi/file-systems.png)

8. After the data has been successfully loaded into Power BI, you'll see the following fields in the **Fields** tab.

    ![Fields tab](media/data-lake-storage-use-power-bi/fields.png)

    However, to visualize and analyze the data, we prefer the data to be available per the following fields.

    ![Fields](media/data-lake-storage-use-power-bi/preferred-fields.png)

    In the next steps, we will update the query to convert the imported data in the desired format.

9. From the **Home** tab on the ribbon, click **Edit Queries**.

    ![Queries](media/data-lake-storage-use-power-bi/queries.png)

10. In the **Query Editor**, under the **Content** column, click **Binary**. The file will automatically be detected as CSV and you should see an output as shown below. Your data is now available in a format that you can use to create visualizations.

    ![Output](media/data-lake-storage-use-power-bi/binary.png)

11. From the **Home** tab on the ribbon, click **Close** and **Apply**, and then click **Close** and **Apply**.

    ![Close and apply](media/data-lake-storage-use-power-bi/close-apply.png)

12. Once the query is updated, the **Fields** tab will show the new fields available for visualization.

    ![New fields](media/data-lake-storage-use-power-bi/new-fields.png)

13. Let us create a pie chart to represent the drivers in each city for a given country. To do so, make the following selections.

    From the **Visualizations** tab, click the symbol for a pie chart.

    ![Visualizations](media/data-lake-storage-use-power-bi/visualizations.png)

    The columns that we are going to use are Column 4 (name of the city) and Column 7 (name of the country). Drag these columns from **Fields** tab to **Visualizations** tab as shown below.

    ![Drag fields](media/data-lake-storage-use-power-bi/visualizations-drag-fields.png)

    The pie chart should now resemble like the one shown below.

    ![Pie chart](media/data-lake-storage-use-power-bi/pie-chart.png)

14. By selecting a specific country from the page level filters, you can now see the number of drivers in each city of the selected country. For example, under the **Visualizations** tab, under **Page level filters**, select **Brazil**.

    ![Page filters](media/data-lake-storage-use-power-bi/page-filters.png)

15. The pie chart is automatically updated to display the drivers in the cities of Brazil.

    ![Brazil](media/data-lake-storage-use-power-bi/pie-chart-updated.png)

16. From the **File** menu, click **Save** to save the visualization as a Power BI Desktop file.

## Publish report to Power BI service

After you've created the visualizations in Power BI Desktop, you can share it with others by publishing it to the Power BI service. For instructions on how to do that, see [Publish from Power BI Desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-upload-desktop-files/).