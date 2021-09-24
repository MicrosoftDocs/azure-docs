## Enable scaling plans for existing and new host pools

You can enable scaling plans for any existing host pools in your deployment. When you apply your scaling plan to the host pool, it applies to all session hosts within that host pool. Scaling also automatically applies to any new session hosts you create in your assigned host pool. 

If you disable a scaling plan, all assigned resources will remain in the scaling state they were in at the time you disabled it.

Using Azure Portal
------------------

Open the Azure portal.

- Navigate to Windows Virtual Desktop

- Select **host pools** and scroll down where you can see the new option under settings Scaling plan.

![](media/f68ee5b51396fdf60e4c7d7910848b9c.png)

![Graphical user interface, application Description automatically generated](media/f68ee5b51396fdf60e4c7d7910848b9c.png)

- Select Scaling plan to either:

    ![](media/352ef2258c6a7cb862a7fec57dd881d6.png)

    Assign a scaling plan if there is none assigned.

    - When you have enabled the scaling plan during deployment you have the option to disable the plan for the selected host pool here.

        ![Graphical user interface, text, application, email Description automatically generated](media/8e65d9913651538ee18b4d3b679b1305.png)

Edit existing scaling plan using the Azure Portal
=================================================

- Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

- Navigate to “Windows Virtual Desktop”

- Select scaling plans and select the scaling plan name to view the scaling plan details.

- Navigate to

    - properties to edit friendly name, description, time zone or exclusion tags.

    - Manage section to assign host pools or edit schedules.