---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 12/17/2021
---

To modify the sample code to use the X.509 certificates:

1. Navigate to the _azure-iot-device/samples/pnp_ folder and open the **temp_controller_with_thermostats.py** file in a text editor.

1. Add the following `from` statement to import the X.509 functionality:

    ```python
    from azure.iot.device import X509
    ```

1. Modify the first part of the `provision_device` function as follows:

    ```python
    async def provision_device(provisioning_host, id_scope, registration_id, x509, model_id):
        provisioning_device_client = ProvisioningDeviceClient.create_from_x509_certificate(
            provisioning_host=provisioning_host,
            registration_id=registration_id,
            id_scope=id_scope,
            x509=x509,
        )
    ```

1. In the `main` function, replace the line that sets the `symmetric_key` variable with the following code:

    ```python
    x509 = X509(
        cert_file=os.getenv("IOTHUB_DEVICE_X509_CERT"),
        key_file=os.getenv("IOTHUB_DEVICE_X509_KEY"),
    )
    ```

1. In the `main` function, replace the call to the `provision_device` function with the following code:

    ```python
    registration_result = await provision_device(
        provisioning_host, id_scope, registration_id, x509, model_id
    )
    ```

1. In the `main` function, replace the call to the `IoTHubDeviceClient.create_from_symmetric_key` function with the following code:

    ```python
    device_client = IoTHubDeviceClient.create_from_x509_certificate(
        x509=x509,
        hostname=registration_result.registration_state.assigned_hub,
        device_id=registration_result.registration_state.device_id,
        product_info=model_id,
    )
    ```

    Save the changes.
