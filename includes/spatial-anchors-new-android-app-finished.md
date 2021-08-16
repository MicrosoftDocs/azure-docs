---
author: pamistel
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.date: 08/05/2021
ms.topic: include
ms.author: pamistel
ms.service: azure-spatial-anchors
---

```java
package com.example.myfirstapp;

import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;

import androidx.appcompat.app.AppCompatActivity;

import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.ArSceneView;
import com.google.ar.sceneform.FrameTime;
import com.google.ar.sceneform.Scene;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.Color;
import com.google.ar.sceneform.rendering.MaterialFactory;
import com.google.ar.sceneform.rendering.Renderable;
import com.google.ar.sceneform.rendering.ShapeFactory;
import com.google.ar.sceneform.ux.ArFragment;

import com.microsoft.azure.spatialanchors.AnchorLocateCriteria;
import com.microsoft.azure.spatialanchors.CloudSpatialAnchor;
import com.microsoft.azure.spatialanchors.CloudSpatialAnchorSession;
import com.microsoft.azure.spatialanchors.LocateAnchorStatus;
import com.microsoft.azure.spatialanchors.SessionLogLevel;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private boolean tapExecuted = false;
    private final Object syncTaps = new Object();
    private ArFragment arFragment;
    private AnchorNode anchorNode;
    private Renderable nodeRenderable = null;
    private float recommendedSessionProgress = 0f;

    private ArSceneView sceneView;
    private CloudSpatialAnchorSession cloudSession;
    private boolean sessionInitialized = false;

    private String anchorId = null;
    private boolean scanningForUpload = false;
    private final Object syncSessionProgress = new Object();
    private ExecutorService executorService = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.arFragment = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);
        this.arFragment.setOnTapArPlaneListener(this::handleTap);

        this.sceneView = arFragment.getArSceneView();
        Scene scene = sceneView.getScene();
        scene.addOnUpdateListener(frameTime -> {
            if (this.cloudSession != null) {
                this.cloudSession.processFrame(sceneView.getArFrame());
            }
        });
        scene.addOnUpdateListener(this::scene_OnUpdate);
        initializeSession();
    }

    // <scene_OnUpdate>
    private void scene_OnUpdate(FrameTime frameTime) {
        if (!sessionInitialized) {
            //retry if initializeSession did an early return due to ARCore Session not yet available (i.e. sceneView.getSession() == null)
            initializeSession();
        }
    }
    // </scene_OnUpdate>

    // <initializeSession>
    private void initializeSession() {
        if (sceneView.getSession() == null) {
            //Early return if the ARCore Session is still being set up
            return;
        }

        if (this.cloudSession != null) {
            this.cloudSession.close();
        }
        this.cloudSession = new CloudSpatialAnchorSession();
        this.cloudSession.setSession(sceneView.getSession());
        this.cloudSession.setLogLevel(SessionLogLevel.Information);
        this.cloudSession.addOnLogDebugListener(args -> Log.d("ASAInfo", args.getMessage()));
        this.cloudSession.addErrorListener(args -> Log.e("ASAError", String.format("%s: %s", args.getErrorCode().name(), args.getErrorMessage())));

        sessionInitialized = true;

        this.cloudSession.addSessionUpdatedListener(args -> {
            synchronized (this.syncSessionProgress) {
                this.recommendedSessionProgress = args.getStatus().getRecommendedForCreateProgress();
                Log.i("ASAInfo", String.format("Session progress: %f", this.recommendedSessionProgress));
                if (!this.scanningForUpload) {
                    return;
                }
            }

            runOnUiThread(() -> {
                synchronized (this.syncSessionProgress) {
                    MaterialFactory.makeOpaqueWithColor(this, new Color(
                            this.recommendedSessionProgress,
                            this.recommendedSessionProgress,
                            this.recommendedSessionProgress))
                            .thenAccept(material -> {
                                this.nodeRenderable.setMaterial(material);
                            });
                }
            });
        });

        this.cloudSession.addAnchorLocatedListener(args -> {
            if (args.getStatus() == LocateAnchorStatus.Located) {
                runOnUiThread(() -> {
                    this.anchorNode = new AnchorNode();
                    this.anchorNode.setAnchor(args.getAnchor().getLocalAnchor());
                    MaterialFactory.makeOpaqueWithColor(this, new Color(android.graphics.Color.GREEN))
                            .thenAccept(greenMaterial -> {
                                this.nodeRenderable = ShapeFactory.makeSphere(0.1f, new Vector3(0.0f, 0.15f, 0.0f), greenMaterial);
                                this.anchorNode.setRenderable(nodeRenderable);
                                this.anchorNode.setParent(arFragment.getArSceneView().getScene());

                                this.anchorId = null;
                                synchronized (this.syncTaps) {
                                    this.tapExecuted = false;
                                }
                            });
                });
            }
        });

        this.cloudSession.getConfiguration().setAccountId(/* Copy your account Identifier in here */);
        this.cloudSession.getConfiguration().setAccountKey(/* Copy your account Key in here */);
        this.cloudSession.getConfiguration().setAccountDomain(/* Copy your account Domain in here */);
        this.cloudSession.start();
    }
    // </initializeSession>

    // <handleTap>
    protected void handleTap(HitResult hitResult, Plane plane, MotionEvent motionEvent) {
        synchronized (this.syncTaps) {
            if (this.tapExecuted) {
                return;
            }

            this.tapExecuted = true;
        }

        if (this.anchorId != null) {
            this.anchorNode.getAnchor().detach();
            this.anchorNode.setParent(null);
            this.anchorNode = null;
            initializeSession();
            AnchorLocateCriteria criteria = new AnchorLocateCriteria();
            criteria.setIdentifiers(new String[]{this.anchorId});
            cloudSession.createWatcher(criteria);
            return;
        }

        this.anchorNode = new AnchorNode();
        this.anchorNode.setAnchor(hitResult.createAnchor());
        CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor();
        cloudAnchor.setLocalAnchor(this.anchorNode.getAnchor());

        MaterialFactory.makeOpaqueWithColor(this, new Color(
                this.recommendedSessionProgress,
                this.recommendedSessionProgress,
                this.recommendedSessionProgress))
                .thenAccept(material -> {
                    this.nodeRenderable = ShapeFactory.makeSphere(0.1f, new Vector3(0.0f, 0.15f, 0.0f), material);
                    this.anchorNode.setRenderable(nodeRenderable);
                    this.anchorNode.setParent(arFragment.getArSceneView().getScene());
                });


        uploadCloudAnchorAsync(cloudAnchor)
                .thenAccept(id -> {
                    this.anchorId = id;
                    Log.i("ASAInfo", String.format("Cloud Anchor created: %s", this.anchorId));
                    runOnUiThread(() -> {
                        MaterialFactory.makeOpaqueWithColor(this, new Color(android.graphics.Color.BLUE))
                                .thenAccept(blueMaterial -> {
                                    this.nodeRenderable.setMaterial(blueMaterial);
                                    synchronized (this.syncTaps) {
                                        this.tapExecuted = false;
                                    }
                                });
                    });
                });
    }
    // </handleTap>

    // <uploadCloudAnchorAsync>
    private CompletableFuture<String> uploadCloudAnchorAsync(CloudSpatialAnchor anchor) {
        synchronized (this.syncSessionProgress) {
            this.scanningForUpload = true;
        }


        return CompletableFuture.runAsync(() -> {
            try {
                float currentSessionProgress;
                do {
                    synchronized (this.syncSessionProgress) {
                        currentSessionProgress = this.recommendedSessionProgress;
                    }
                    if (currentSessionProgress < 1.0) {
                        Thread.sleep(500);
                    }
                }
                while (currentSessionProgress < 1.0);

                synchronized (this.syncSessionProgress) {
                    this.scanningForUpload = false;
                }
                runOnUiThread(() -> {
                    MaterialFactory.makeOpaqueWithColor(this, new Color(android.graphics.Color.YELLOW))
                            .thenAccept(yellowMaterial -> {
                                this.nodeRenderable.setMaterial(yellowMaterial);
                            });
                });

                this.cloudSession.createAnchorAsync(anchor).get();
            } catch (InterruptedException | ExecutionException e) {
                Log.e("ASAError", e.toString());
                throw new RuntimeException(e);
            }
        }, executorService).thenApply(ignore -> anchor.getIdentifier());
    }
    // </uploadCloudAnchorAsync>

}
```