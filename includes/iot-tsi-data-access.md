---
 title: include file
 description: include file
 services: time-series-insights
 author: ashannon7
 ms.service: time-series-insights
 ms.topic: include
 ms.date: 08/20/2018
 ms.author: anshan
 ms.custom: include file
---

## Grant data access

Follow these steps to grant data access for a user principal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Locate your Time Series Insights environment. Type **Time Series** in the **search** box. Select **Time Series Environment** in the search results. 

3. Select your Time Series Insights environment from the list.

4. Select **Data Access Policies**, then select **+ Add**.
    ![Manage the Time Series Insights source - environment](media/iot-tsi-data-access/getstarted-grant-data-access1.png)

5. Select **Select user**.  Search for the user name or email address to locate the user you want to add. Click **Select** to confirm the selection. 

    ![Manage the Time Series Insights source - add](media/iot-tsi-data-access/getstarted-grant-data-access2.png)

6. Select **Select role**. Choose the appropriate access role for the user:
    - Select **Contributor** if you want to allow user to change reference data and share saved queries and perspectives with other users of the environment. 
    - Otherwise, select **Reader** to allow user query data in the environment and save personal (not shared) queries in the environment.

    Select **Ok** to confirm the role choice.

    ![Manage the Time Series Insights source - select user](media/iot-tsi-data-access/getstarted-grant-data-access3.png)

7. Select **Ok** in the **Select User Role** page.

    ![Manage the Time Series Insights source - select role](media/iot-tsi-data-access/getstarted-grant-data-access4.png)

8. The **Data Access Policies** page lists the users and the role(s) for each user.

    ![Manage the Time Series Insights source - results](media/iot-tsi-data-access/getstarted-grant-data-access5.png)