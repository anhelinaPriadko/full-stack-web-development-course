const Content = (props) => {
    return (
        <>
            <ContentLine part={props.part1} exercises={props.exercises1} />
            <ContentLine part={props.part2} exercises={props.exercises2} />
            <ContentLine part={props.part3} exercises={props.exercises3} /> 
        </>
    );
}

export default Content;