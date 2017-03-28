# Service Notifications #
## Overview ##
This article shows you how to view service notifications using the Azure portal.

Service notifications enable you to view service health messages published by the Azure team that may be affecting resources under your subscription. These notifications are a sub-class of activity log events and can also be found on the activity log blade. Service notifications can be informational or actionable depending on the class.

There are five classes of service notifications:

**Action Required:** From time to time we may notice something unusual happen on your account. We may need to work with you to remedy this. We will send you a notification either detailing the actions you will need to take or with details on how to contact Azure engineering or support.

**Assisted Recovery:** An event has occurred and engineers have confirmed that you are still experiencing impact. Engineering will need to work with you directly to bring your services to restoration.

**Incident:** A service impacting event is currently affecting one or more of the resources in your subscription.

**Maintenance:** This is a notification informing you of a planned maintenance activity that may impact one or more of the resources under your subscription.

**Information:** From time to time we may send you notifications that a communicate to you about potential optimizations that may help improve your resource utilization.

**Security:** Urgent security related information regarding your solution(s) running on Azure.

Each service notification will carry details on the scope and impact to your resources. Details will include:

Metadata | Exposed | Description
-------- | ------- | -----------
Title | Portal/JSON | Short descriptor of the event
Status | Portal/JSON | **Active:** The event is still ongoing and so, you may still see impact or have actions to take. **Resolved:** The event is no longer impacting your subscription
Incident Type | Portal/JSON	| One of the values described above: Incident, Maintenance, etc.
Communication | Portal/JSON | Message from the Azure team describing the impact of the event
Service | Portal/JSON | The Azure Service the event pertains to
Region | Portal/JSON | The region(s) that the event pertains to
Resource ID	| Portal/JSON | The Azure subscription the event pertains to
Operation Name | Portal/JSON | The ARM operation name for this event
Timestamp | Portal/JSON | The time the event was posted to Activity Logs
Category | Portal/JSON | For service notifications, this will always say “Service Health”. Do note there are other event categories that are visible in the ‘Activity Log’.
Level | Portal/JSON | The values are: **Informational, Warning** and **Critical.**

A more detailed break down of the service notification schema can be found here(document needed here)

## Viewing your service notifications in the Azure portal ##
1.	In the [portal](https://portal.azure.com), navigate to the Monitor service

2.	Click the Monitor option to open up the Monitor blade. This blade brings together all your monitoring settings and data into one consolidated view. It first opens to the Activity log section.

3.	Now click on Service Notifications section

4.	Click on any of the line items to view more details

## Next Steps: ##
Receive [alert notifications whenever a service notification](monitoring-activity-log-alerts-on-service-notifications.md) is posted

Learn more about [activity log alerts](monitoring-activity-log-alerts.md)
