import { useCounterContext } from "../../context";
import CounterCard from "./CounterCard";

const Counter = () => {
  const { mongo, redis } = useCounterContext();

  return (
    <div
      className="
            col-span-4
            tablet:col-span-6
            desktop:col-span-12

            bg-white
            desktop:p-16
            tablet:p-8
            p-8
            rounded-xl
            space-y-8
          "
    >
      <div className="flex flex-col">
        <h1 className="font-bold">Counter</h1>
        <p className="font-medium text-sm text-gray-500">
          A component to track the current count that is stored in the Mongo and Redis databases
        </p>
      </div>
      <div className="flex gap-4 flex-col">
        <CounterCard
          image_url="/assets/MongoDB_SlateBlue.svg"
          database="mongo"
          data={mongo.data}
          loading={mongo.isLoading}
          error={mongo.isError}
        />
        <CounterCard
          image_url="/assets/Redis_Logo_Red_RGB.svg"
          database="redis"
          data={redis.data}
          loading={redis.isLoading}
          error={redis.isError}
        />
      </div>
    </div>
  );
};

export default Counter;
