const StatCard = ({ active, title, today, total, color, onClick }) => {
  return (
    <div
      className={`rounded m-2 p-2 dark:border-2 dark:border-slate-500 dark:shadow-slate-900 
      ${active ? "shadow-inner dark:bg-slate-600" : "shadow-xl"}`}
      onClick={onClick}
    >
      <p className="text-base">{title}</p>
      <p className={`text-xl ${color}`}>{`+ ${today}`}</p>
      <p className="text-sm text-thin">{`${total} Total`}</p>
    </div>
  );
};

export default StatCard;
