---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/15/2022
ms.author: eur
---
[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser). Check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-go) for any more requirements

## Perform independent identification

Follow these steps to create a new GO module.

1. Open a command prompt where you want the new module, and create a new file named `independent-identification.go`.
1. Replace the contents of `independent-identification.go` with the following code. 

    ```go
    package speaker_recognition

    import (
        "bufio"
        "fmt"
        "os"
        "time"

        "github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
        "github.com/Microsoft/cognitive-services-speech-sdk-go/common"
        "github.com/Microsoft/cognitive-services-speech-sdk-go/speaker"
        "github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
    )

    func GetNewVoiceProfileFromClient(client *speaker.VoiceProfileClient, expectedType common.VoiceProfileType) *speaker.VoiceProfile {
        future := client.CreateProfileAsync(expectedType, "en-US")
        outcome := <-future
        if outcome.Failed() {
            fmt.Println("Got an error creating profile: ", outcome.Error.Error())
            return nil
        }
        profile := outcome.Profile
        _, err := profile.Id()
        if err != nil {
            fmt.Println("Unexpected error creating profile id: ", err)
            return nil
        }
        profileType, err := profile.Type();
        if err != nil {
            fmt.Println("Unexpected error getting profile type: ", err)
            return nil
        }
        if profileType != expectedType {
            fmt.Println("Profile type does not match expected type")
            return nil
        }
        return profile
    }

    func EnrollProfile(client *speaker.VoiceProfileClient, profile *speaker.VoiceProfile, audioConfig *audio.AudioConfig) {
        enrollmentReason, currentReason := common.EnrollingVoiceProfile, common.EnrollingVoiceProfile
        var currentResult *speaker.VoiceProfileEnrollmentResult
        expectedEnrollmentCount := 1
        for currentReason == enrollmentReason {
            fmt.Println(`Please speak the following phrase: "I'll talk for a few seconds so you can recognize my voice in the future."`)
            enrollFuture := client.EnrollProfileAsync(profile, audioConfig)
            enrollOutcome := <-enrollFuture
            if enrollOutcome.Failed() {
                fmt.Println("Got an error enrolling profile: ", enrollOutcome.Error.Error())
                return
            }
            currentResult = enrollOutcome.Result
            currentReason = currentResult.Reason
            if currentResult.EnrollmentsCount != expectedEnrollmentCount {
                fmt.Println("Unexpected enrollments for profile: ", currentResult.RemainingEnrollmentsCount)
            }
            expectedEnrollmentCount += 1
        }
        if currentReason != common.EnrolledVoiceProfile {
            fmt.Println("Unexpected result enrolling profile: ", currentResult)
        }
    }

    func DeleteProfile(client *speaker.VoiceProfileClient, profile *speaker.VoiceProfile) {
        deleteFuture := client.DeleteProfileAsync(profile)
        deleteOutcome := <-deleteFuture
        if deleteOutcome.Failed() {
            fmt.Println("Got an error deleting profile: ", deleteOutcome.Error.Error())
            return
        }
        result := deleteOutcome.Result
        if result.Reason != common.DeletedVoiceProfile {
            fmt.Println("Unexpected result deleting profile: ", result)
        }
    }

    func main() {
        subscription :=  "YourSubscriptionKey"
        region := "YourServiceRegion"
        config, err := speech.NewSpeechConfigFromSubscription(subscription, region)
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer config.Close()
        client, err := speaker.NewVoiceProfileClientFromConfig(config)
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer client.Close()
        audioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer audioConfig.Close()
        <-time.After(10 * time.Second)
        expectedType := common.VoiceProfileType(1)
        
        profile := GetNewVoiceProfileFromClient(client, expectedType)
        if profile == nil {
            fmt.Println("Error creating profile")
            return
        }
        defer profile.Close()

        EnrollProfile(client, profile, audioConfig)

        profiles := []*speaker.VoiceProfile{profile}
        model, err := speaker.NewSpeakerIdentificationModelFromProfiles(profiles)
        if err != nil {
            fmt.Println("Error creating Identification model: ", err)
        }
        if model == nil {
            fmt.Println("Error creating Identification model: nil model")
            return
        }
        identifyAudioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer identifyAudioConfig.Close()
        speakerRecognizer, err := speaker.NewSpeakerRecognizerFromConfig(config, identifyAudioConfig)
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        identifyFuture := speakerRecognizer.IdentifyOnceAsync(model)
        identifyOutcome := <-identifyFuture
        if identifyOutcome.Failed() {
            fmt.Println("Got an error identifying profile: ", identifyOutcome.Error.Error())
            return
        }
        identifyResult := identifyOutcome.Result
        if identifyResult.Reason != common.RecognizedSpeakers {
            fmt.Println("Got an unexpected result identifying profile: ", identifyResult)
        }
        expectedID, _ := profile.Id()
        if identifyResult.ProfileID != expectedID {
            fmt.Println("Got an unexpected profile id identifying profile: ", identifyResult.ProfileID)
        }
        if identifyResult.Score < 1.0 {
            fmt.Println("Got an unexpected score identifying profile: ", identifyResult.Score)
        }

        DeleteProfile(client, profile)
        bufio.NewReader(os.Stdin).ReadBytes('\n')
    }
    ```

1. In `independent-identification.go`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.
    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.

Run the following commands to create a `go.mod` file that links to components hosted on GitHub:

```cmd
go mod init independent-identification
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```cmd
go build
go run independent-identification
```

## Perform independent verification

Follow these steps to create a new GO module.

1. Open a command prompt where you want the new module, and create a new file named `independent-verification.go`.
1. Replace the contents of `independent-verification.go` with the following code. 

    ```go
    package speaker_recognition

    import (
        "bufio"
        "fmt"
        "os"
        "time"

        "github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
        "github.com/Microsoft/cognitive-services-speech-sdk-go/common"
        "github.com/Microsoft/cognitive-services-speech-sdk-go/speaker"
        "github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
    )

    func GetNewVoiceProfileFromClient(client *speaker.VoiceProfileClient, expectedType common.VoiceProfileType) *speaker.VoiceProfile {
        future := client.CreateProfileAsync(expectedType, "en-US")
        outcome := <-future
        if outcome.Failed() {
            fmt.Println("Got an error creating profile: ", outcome.Error.Error())
            return nil
        }
        profile := outcome.Profile
        _, err := profile.Id()
        if err != nil {
            fmt.Println("Unexpected error creating profile id: ", err)
            return nil
        }
        profileType, err := profile.Type();
        if err != nil {
            fmt.Println("Unexpected error getting profile type: ", err)
            return nil
        }
        if profileType != expectedType {
            fmt.Println("Profile type does not match expected type")
            return nil
        }
        return profile
    }

    func EnrollProfile(client *speaker.VoiceProfileClient, profile *speaker.VoiceProfile, audioConfig *audio.AudioConfig) {
        enrollmentReason, currentReason := common.EnrollingVoiceProfile, common.EnrollingVoiceProfile
        var currentResult *speaker.VoiceProfileEnrollmentResult
        expectedEnrollmentCount := 1
        for currentReason == enrollmentReason {
            fmt.Println(`Please speak the following phrase: "I'll talk for a few seconds so you can recognize my voice in the future."`)
            enrollFuture := client.EnrollProfileAsync(profile, audioConfig)
            enrollOutcome := <-enrollFuture
            if enrollOutcome.Failed() {
                fmt.Println("Got an error enrolling profile: ", enrollOutcome.Error.Error())
                return
            }
            currentResult = enrollOutcome.Result
            currentReason = currentResult.Reason
            if currentResult.EnrollmentsCount != expectedEnrollmentCount {
                fmt.Println("Unexpected enrollments for profile: ", currentResult.RemainingEnrollmentsCount)
            }
            expectedEnrollmentCount += 1
        }
        if currentReason != common.EnrolledVoiceProfile {
            fmt.Println("Unexpected result enrolling profile: ", currentResult)
        }
    }

    func DeleteProfile(client *speaker.VoiceProfileClient, profile *speaker.VoiceProfile) {
        deleteFuture := client.DeleteProfileAsync(profile)
        deleteOutcome := <-deleteFuture
        if deleteOutcome.Failed() {
            fmt.Println("Got an error deleting profile: ", deleteOutcome.Error.Error())
            return
        }
        result := deleteOutcome.Result
        if result.Reason != common.DeletedVoiceProfile {
            fmt.Println("Unexpected result deleting profile: ", result)
        }
    }

    func main() {
        subscription :=  "YourSubscriptionKey"
        region := "YourServiceRegion"
        config, err := speech.NewSpeechConfigFromSubscription(subscription, region)
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer config.Close()
        client, err := speaker.NewVoiceProfileClientFromConfig(config)
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer client.Close()
        audioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer audioConfig.Close()
        <-time.After(10 * time.Second)
        expectedType := common.VoiceProfileType(3)
        
        profile := GetNewVoiceProfileFromClient(client, expectedType)
        if profile == nil {
            fmt.Println("Error creating profile")
            return
        }
        defer profile.Close()

        EnrollProfile(client, profile, audioConfig)

        model, err := speaker.NewSpeakerVerificationModelFromProfile(profile)
        if err != nil {
            fmt.Println("Error creating Verification model: ", err)
        }
        if model == nil {
            fmt.Println("Error creating Verification model: nil model")
            return
        }
        verifyAudioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer verifyAudioConfig.Close()
        speakerRecognizer, err := speaker.NewSpeakerRecognizerFromConfig(config, verifyAudioConfig)
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        verifyFuture := speakerRecognizer.VerifyOnceAsync(model)
        verifyOutcome := <-verifyFuture
        if verifyOutcome.Failed() {
            fmt.Println("Got an error verifying profile: ", verifyOutcome.Error.Error())
            return
        }
        verifyResult := verifyOutcome.Result
        if verifyResult.Reason != common.RecognizedSpeaker {
            fmt.Println("Got an unexpected result verifying profile: ", verifyResult)
        }
        expectedID, _ := profile.Id()
        if verifyResult.ProfileID != expectedID {
            fmt.Println("Got an unexpected profile id verifying profile: ", verifyResult.ProfileID)
        }
        if verifyResult.Score < 1.0 {
            fmt.Println("Got an unexpected score verifying profile: ", verifyResult.Score)
        }

        DeleteProfile(client, profile)
        bufio.NewReader(os.Stdin).ReadBytes('\n')
    }
    ```

1. In `independent-verification.go`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

Run the following commands to create a `go.mod` file that links to components hosted on GitHub:

```cmd
go mod init independent-verification
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```cmd
go build
go run independent-verification
```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
