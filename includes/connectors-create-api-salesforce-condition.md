This condition will evaluate the email address field of each new Salesforce lead. If the email address contains *amazon.com*, the condition result will be *True*.

1. Select **+ New step**.  
![](./media/connectors-create-api-salesforce/condition-1.png)   
- Select **Add a condition**.    
![](./media/connectors-create-api-salesforce/condition-2.png)  
- Select **Choose a value**.    
![](./media/connectors-create-api-salesforce/condition-3.png)  
- Select the *Email* token from the lead of the trigger.    
![](./media/connectors-create-api-salesforce/condition-4.png)  
- Select *Contains*.      
![](./media/connectors-create-api-salesforce/condition-5.png)  
- Select **Choose a value** at the bottom of the control.     
![](./media/connectors-create-api-salesforce/condition-6.png)  
- Enter *amazon.com* as the value you would like to evaluate the email address of the new lead for. If the email address contains *amazon.com*, the condition will evaluate to *True* and the other steps in your logic app can proceed.    
![](./media/connectors-create-api-salesforce/condition-7.png)  
- Save your logic apps.  

