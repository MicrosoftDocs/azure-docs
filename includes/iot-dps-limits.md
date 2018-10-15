The following table lists the limits that apply to IoT Hub Device Provisioning Service resources:

| Resource | Limit |
| --- | --- |
| Maximum Device Provisioning Services per Azure subscription | 10 |
| Maximum number of enrollments | 500,000 |
| Maximum number of registrations | 500,000 |
| Maximum number of enrollment groups | 100 |
| Maximum number of CAs | 25 |

> [!NOTE]
> You can contact [Microsoft Support](https://azure.microsoft.com/support/options/) to increase the number of instances in your subscription.

> [!NOTE]
> You can contact [Microsoft Support](https://azure.microsoft.com/support/options/) to increase the number of enrollments and registrations on your provisioning service.

The Device Provisioning Service throttles requests when the following quotas are exceeded:

| Throttle | Per-unit value |
| --- | --- |
| Operations | 200/min/service |
| Device registrations | 200/min/service |
| Device polling operation | 5/10sec/device |
