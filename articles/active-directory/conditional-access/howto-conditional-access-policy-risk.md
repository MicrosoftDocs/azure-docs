---
title: 
description: Create a custom Conditional Access policy to 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: Risk-based multi-factor authentication

Along with protecting tenant administrators and privileged actions, the rest of the users in your tenant need to be protected as well. We recommend using a risk based MFA policy to help protect all of your users with MFA while striking a balance between usability and security. 
Note: An Azure AD P2 license is required to configure these policies. Additionally, the risk configurations explained in the walkthrough is simply a recommendation. Please configure policies specific to the security needs of your environment.
The below tutorial explains how to configure policies using Azure AD Identity Protection that accomplish the below recommendations:
1.	Requiring all users in your tenant to register for MFA
2.	Requiring password change for users that are high risk
3.	Requiring MFA for users with medium and high sign-in risk 
 
On the Azure Portal, search for the “Azure AD Identity Protection” service. You should click on the corresponding service and see the following blade:
 
The first policy that will be enabled is 14 day MFA Registration.
Part 1: Enabling 14 day MFA Registration

On the Azure Identity Protection Overview page (seen in the above screenshot), under the Configure tab, click on MFA Registration. You should see the following blade below:
 
 
Next, under Assignments, click on Users. Under the Include tab, select All users to specify that this policy will apply to all users. However, if there are any users you want to exclude, click on the Exclude tab and specify the users accordingly.
Then, click Done.

 
 
You will now be back on the MFA Registration blade. Next, under the Controls tab, click on Access. You should see the following screen below. Make sure to check the box that says Require Azure MFA Registration. This ensures that this specific policy is applied to the users you specified above. Once that box is checked, make sure to click Select.

 

This will take you back to the MFA registration blade again and the last step is to toggle the Enable Policy to “On” and then click Save to save the results. You’ve now set up a MFA Registration policy.
Part 2: Configure User Risk Policy

The next step is to configure the User risk policy. Under the configure tab (as seen below), click on User risk policy and the following blade should appear.
 
First, under Assignments, click on Users, and the following tab below will appear. Under Include, make sure to select All Users to apply this user risk policy to all users. However, if there are some users you would like to exclude, click on the Exclude tab and exclude users accordingly. Once finished, click Done. 

 
Now, you will be back on the main blade for User risk policy. The next step is to set the user risk. To do so, under Assignments, select Conditions. Then, click on User risk. The following blade appears below. Set the user risk to High by  selecting the High bubble under “Select the user risk level”. This means that the user risk policy will apply when the given user’s risk is deemed to be “High”. 

Then, click Select on the User risk blade and then select Done on the Conditions blade to save changes.
 
The last step to configuring user risk policy is specifying the controls. Under the Controls tab, select Access. The following blade below should appear. Make sure to select Allow Access and check the Require password change box. Then click Select.




 

Finally, as is seen below, toggle the Enforce policy item to “On” and then click Save to apply your changes.

 

Part 3: Sign-in Risk Policy

The final aspect is to specify the sign-in risk policy. Under the Configure tab, select Sign-in risk policy. You should see a page similar to below:
 
Under Assignments, select Users. You will see a tab as is seen in the screenshot below. Under Include, make sure to select All Users to ensure the policy applies to all users. In the case there are users you would like to exclude, you can click on the Exclude tab and specify these users.
Once finished, select Done.
 
Next, under Assignments, click on the Conditions tab. Then, in the new blade, click on the Sign-in risk button and you should see the following below:
 
As is shown in the screenshot above, select the sign-in risk level as Meduim and above. Then, click Select and then Done to save changes.
Lastly, under Controls, select Access. As seen in the screenshot below, make sure to select Allow Access and check the box for Require multi-factor authentication. Then, click Select.



 
To save changes, make sure to toggle Enforce Policy to On and click Save. You have now configured your MFA registration in addition to user risk policy and user sign-in risk policy!

