import type { PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="
          grid
          desktop:grid-cols-12
          tablet:grid-cols-6
          grid-cols-4
          desktop:max-w-[1280px]
          desktop:gap-x-8
          tablet:gap-x-8
          gap-x-4
        "
    >
      {children}
    </div>
  );
};

export default Container;
