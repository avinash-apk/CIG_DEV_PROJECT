import { RekognitionClient, DetectLabelsCommand, IndexFacesCommand, SearchFacesByImageCommand } from '@aws-sdk/client-rekognition';
import dotenv from 'dotenv';

dotenv.config();

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const detectLabels = async (bucket: string, key: string) => {
  const command = new DetectLabelsCommand({
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
    MaxLabels: 10,
    MinConfidence: 70,
  });
  return rekognitionClient.send(command);
};

export const indexFace = async (bucket: string, key: string, externalImageId: string) => {
  const command = new IndexFacesCommand({
    CollectionId: process.env.REKOGNITION_COLLECTION_ID!,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
    ExternalImageId: externalImageId,
    MaxFaces: 1,
    QualityFilter: 'AUTO',
  });
  return rekognitionClient.send(command);
};

export const searchFaces = async (bucket: string, key: string) => {
  const command = new SearchFacesByImageCommand({
    CollectionId: process.env.REKOGNITION_COLLECTION_ID!,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
    MaxFaces: 5,
    FaceMatchThreshold: 80,
  });
  return rekognitionClient.send(command);
};

export { rekognitionClient };
