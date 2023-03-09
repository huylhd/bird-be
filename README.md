### Initialize the project

#### Database

- Our database of choice is `PostgreSQL`
- For ORM we'll go with `TypeORM`

#### API

- Prefixed with `/api`

### Authentication

- Implement an auth guard to make sure the `X-UBID` header matches the requested ubid

### Update occupancy

- Create a table named `house_histories` to store the history of residence
- The new table will reference `ubid`, which is not the primary key, so instead of creating a foreign key we store it as a normal column
- Whenever update the occupancy of a house, add a history record
- Using transaction to ensure data consistency

### Logging

- Add a middleware for logging the request and response of every endpoints

### Prune houses

- For pruning houses we set up a cron job for the task
- This task doesn't require frequent execution, so we can schedule it to run once a day at 3AM (low traffic)

### Testing

- Implement unit test using Jest for: HouseService and AuthGuard

### Bulk insert

- Change endpoint from `/api/house` to plural form `/api/houses`
- Update create logic to create bulk
- Update unit test for HouseService.createBulk
