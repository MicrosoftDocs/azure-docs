# Rate Limiting
In order to ensure that communication around activity log alerts and service health alerts are manageable and actionable, rate limiting on SMS and Email alerts have been put in place.

>[!NOTE]
>This feature is currently in public preview. Not all functionality may be available at this time.
>
>

## Rate Limit for SMS Alerts
Rate limiting for SMS alerts is configured as follows:
* A particular phone number will be rate limited if they receive more than 10 SMS alerts over the period of an hour
- It is important to note that the rate limiting is applied across all subscriptions. So if a particular phone number is part of action groups across many subscriptions. As soon as 10 SMS alerts are sent to that number, from any combination of subscriptions, rate limiting will kick in
- When a phone number is rate limited an SMS will be sent to communicate the rate limiting. The SMS will carry details as to when the rate limiting will expire.

## Rate Limit for Email Alerts
Rate limiting for email alerts is configured as follows:
* A particular email address will be rate limited if they receive more than 100 email alerts over the period of an hour
- It is important to note that the rate limiting is applied across all subscriptions. So if a particular email address is part of action groups across many subscriptions. As soon as 100 email alerts are sent to that address, from any combination of subscriptions, rate limiting will kick in
- When an email address is rate limited an email will be sent to communicate the rate limiting. The email will carry details as to when the rate limiting will expire.

## Rate Limit of Webhooks ##
There is no rate limiting in place for webhooks today.

## Next Steps ##
Learn more on [SMS alert behavior](monitoring-sms-alert-behavior.md)  
Get an [overview of activity log alerts](monitoring-overview-alerts.md) and learn how to get alerted  
How to [configure alerts whenever a service health notification is posted](monitoring-activity-log-alerts-on-service-notifications.md)
