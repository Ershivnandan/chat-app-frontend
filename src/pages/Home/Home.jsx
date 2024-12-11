

const Home = () => {
  return (
    <>
      <div className="mx-5 h-screen">
        <div className="flex md:flex-row  flex-col-reverse justify-between mt-5">
          <div className="w-full flex flex-col gap-4 justify-center items-center text-center">
            <p className="md:text-9xl sm:text-7xl text-5xl line-clamp-2 overflow-clip font-medium">
              Reach To Your One!
            </p>
            <p className="mt-2 text-2xl text-gray-500 font-medium">Connect with your friends, experience true privacy.</p>
          </div>
          <div className="flex justify-center items-center">
            <img className="w-full" src="https://ik.imagekit.io/nyw3wwqix/Chat-app/v1%20(1).png?updatedAt=1732282400953" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
