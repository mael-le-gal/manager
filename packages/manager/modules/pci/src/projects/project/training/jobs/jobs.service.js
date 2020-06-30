import Job from "./job.class";

export default class PciProjectTrainingJobsService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  submit(projectId, jobSpec) {
    return this.OvhApiCloudProjectAi
      .Training()
      .Job()
      .v6()
      .save({serviceName: projectId}, jobSpec)
      .$promise
      .then(
        (job) =>
          new Job({
            ...job,
          }),
      );
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectAi
      .Training()
      .Job()
      .v6()
      .query({serviceName: projectId})
      .$promise
      .then((jobs) =>
        jobs.map((job) => new Job({...job}))
      );
    
    /*const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            id: '123',
            state: 'SUCCEEDED',
            image: 'hello-world:latest',
            creator: 'mael.le-gal@ovhcloud.com',
            command: [
              './script.sh',
              '--help'
            ],
            data: [
              "9c4c8b8e-c9fe-4736-a6f6-6549769fc798:/app/data/sentiment_sentences:rw",
              "a972b234-b13a-48e4-bacd-ab9b31f63a6b:/app/data/output:rw",
              "b1d52785-bbd0-4627-a701-f47dca294233:/app/runs:rw"
            ],
            resources: {
              cpu: 1,
              mem: 24,
              gpu: 2
            },
            created: "2020-06-05T14:02:40.919661Z",
            region: "GRA"
          },
          {
            id: '789',
            state: 'FAILED',
            image: 'hello-world:latest',
            creator: 'mael.le-gal@ovhcloud.com',
            region: "GRA"
          },
        ]);
      }, 300);
    });

    return promise.then((jobs) =>
      jobs.map((job) => new Job({...job}))
    );*/
  }

  get(projectId, jobId) {
    // Uncomment when iceberg proded
    return this.OvhApiCloudProjectAi
      .Training()
      .Job()
      .v6()
      .get({
        serviceName: projectId,
        jobId,
      })
      .$promise
      .then(
        (job) =>
          new Job({
            ...job,
          }),
      );

      /*const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = {
            id: '123',
            state: 'SUCCEEDED',
            image: 'hello-world:latest',
            creator: 'mael.le-gal@ovhcloud.com',
            command: [
              './script.sh',
              '--help'
            ],
            data: [
              "9c4c8b8e-c9fe-4736-a6f6-6549769fc798:/app/data/sentiment_sentences:rw",
              "a972b234-b13a-48e4-bacd-ab9b31f63a6b:/app/data/output:rw",
              "b1d52785-bbd0-4627-a701-f47dca294233:/app/runs:rw"
            ],
            resources: {
              cpu: 1,
              mem: 24,
              gpu: 2
            },
            created: "2020-06-05T14:02:40.919661Z",
            region: "GRA"
          };
          const proj2 = {
            id: '789',
            state: 'FAILED',
            image: 'hello-world:latest',
            creator: 'mael.le-gal@ovhcloud.com',
            region: "GRA"
          }
          if (jobId === '789') {
            result = proj2;
          }
          resolve(result);
        }, 300);
      });
      
      return promise.then(
        (job) =>
          new Job({
            ...job,
          }),
      );*/
  }
}
