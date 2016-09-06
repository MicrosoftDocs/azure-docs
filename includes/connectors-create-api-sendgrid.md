### Prerequisites
- A [SendGrid](https://www.SendGrid.com/) account 

Before you can use your SendGrid account in a Logic app, you must authorize the Logic app to connect to your SendGrid account. Fortunately, you can do this easily from within your Logic app on the Azure Portal. 

Here are the steps to authorize your Logic app to connect to your SendGrid account:

1. To create a connection to SendGrid, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *SendGrid* in the search box. Select the trigger or action you'll like to use:  
  ![SendGrid step 1](./media/connectors-create-api-sendgrid/sendgrid-1.png)
2. If you haven't created any connections to SendGrid before, you'll get prompted to provide your SendGrid credentials. These credentials will be used to authorize your Logic app to connect to, and access your SendGrid account's data:  
  ![SendGrid step 2](./media/connectors-create-api-sendgrid/sendgrid-2.png)
3. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
  ![SendGrid step 3](./media/connectors-create-api-sendgrid/sendgrid-3.png)   
