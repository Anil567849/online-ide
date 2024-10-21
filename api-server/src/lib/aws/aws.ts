
// import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'

// const ecsClient = new ECSClient({
//     region: '',
//     credentials: {
//         accessKeyId: '',
//         secretAccessKey: ''
//     }
// })

// const config = {
//     CLUSTER: '',
//     TASK: ''
// }


export async function spinAContainer(){
    
//     const command = new RunTaskCommand({
//         cluster: config.CLUSTER,
//         taskDefinition: config.TASK,
//         launchType: 'FARGATE',
//         count: 1, // one container run
//         networkConfiguration: {
//             awsvpcConfiguration: {
//                 assignPublicIp: 'ENABLED',
//                 subnets: ['', '', ''],
//                 securityGroups: ['']
//             }
//         },
//         overrides: {
//             containerOverrides: [
//                 {
//                     name: 'builder-image', // which docker image to use
//                     environment: [
//                     ]
//                 }
//             ]
//         }
//     })

//     await ecsClient.send(command);
}