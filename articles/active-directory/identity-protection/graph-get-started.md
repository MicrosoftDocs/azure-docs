ent those that may have the capability to trigger Identity Protection sign-in or user-risk policies. Since they have a medium or high likelihood that the user attempting to sign-in is not the legitimate identity owner, remediating these events should be a priority. 

```
GET https://graph.microsoft.com/beta/identityRiskEvents?`$filter=riskLevel eq 'high' or riskLevel eq 'medium'" 
```

## Get all of the users who successfully passed an MFA challenge triggered by risky sign-ins policy (riskyUsers API)
To understand the impact Identity Protection risk-based policies have on your organization you can query all of the users who successfully passed an MFA challenge triggered by a risky sign-ins policy. This information can help you understand which users Identity Protection may have falsely deteted at as risk and which of your legitiamte users may be performing actions that the AI deems risky.
```
GET https://graph.microsoft.com/beta/riskyUsers?$filter=riskDetail eq 'userPassedMFADrivenByRiskBasedPolicy'
```

## Get all the risky sign-ins for a specific user (signIn API)
When you believe a user may have been compromised, you can better understand the state of their risk by retrieving all of their risky sign-ins. 
```
https://graph.microsoft.com/beta/identityRiskEvents?`$filter=userID eq '<userID>' and riskState eq 'atRisk'
```



# Next steps

Congratulations, you just made your first call to Microsoft Graph!  
Now you can query identity risk events and use the data however you see fit.


To learn more about Microsoft Graph and how to build applications using the Graph API, check out the [documentation](https://graph.microsoft.io/docs) and much more on the [Microsoft Graph site](https://graph.microsoft.io/). 


For related information, see:

-  [Azure Active Directory Identity Protection](../active-directory-identityprotection.md)

-  [Types of risk events detected by Azure Active Directory Identity Protection](../reports-monitoring/concept-risk-events.md)

- [Microsoft Graph](https://developer.microsoft.com/graph/)

- [Overview of Microsoft Graph](https://developer.microsoft.com/graph/docs)

- [Azure AD Identity Protection Service Root](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/identityprotection_root)
