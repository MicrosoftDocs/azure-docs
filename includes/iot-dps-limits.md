The following table lists the limits that apply to IoT Hub Device Provisioning Service resources:

| Resource | Limit |
| --- | --- |
| Maximum Device Provisioning Services per Azure subscription | 10 |
| Maximum number of enrollments | 10,000 |
| Maximum number of registrations | 10,000 |
| Maximum number of enrollment groups | 100 |
| Maximum number of CAs | 10 |

> [!NOTE]
> These limits are for public preview. Once the service is generally available, you can contact [Microsoft Support](https://azure.microsoft.com/support/options/) to increase the number of instances in your subscription.

The Device Provisioning Service throttles requests when the following quotas are exceeded:

| Throttle | Per-service value |
| --- | --- |
| Operations | 100/min |
| Device registrations | 100/min |
