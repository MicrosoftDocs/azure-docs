This condition will evaluate the email address field of each new Salesforce lead. If the email address contains *amazon.com*, the condition result will be *True*.

1. Select **+ New step**.  
![Salesforce condition image 1](./media/connectors-create-api-salesforce/condition-1.png)   
- Select **Add a condition**.    
![Salesforce condition image 2](./media/connectors-create-api-salesforce/condition-2.png)  
- Select **Choose a value**.    
![Salesforce condition image 3](./media/connectors-create-api-salesforce/condition-3.png)  
- Select the *Email* token from the lead of the trigger.    
![Salesforce condition image 4](./media/connectors-create-api-salesforce/condition-4.png)  
- Select *Contains*.      
![Salesforce condition image 5](./media/connectors-create-api-salesforce/condition-5.png)  
- Select **Choose a value** at the bottom of the control.     
![Salesforce condition image 6](./media/connectors-create-api-salesforce/condition-6.png)  
- Enter *amazon.com* as the value you would like to evaluate the email address of the new lead for. If the email address contains *amazon.com*, the condition will evaluate to *True* and the other steps in your logic app can proceed.    
![Salesforce condition image 7](./media/connectors-create-api-salesforce/condition-7.png)  
- Save your logic apps.  

