import pytest

from vexture import hex_to_rgba


def test_parses_short_rgb() -> None:
    assert hex_to_rgba("#0f8") == (0, 255, 136, 255)


def test_parses_short_rgba() -> None:
    assert hex_to_rgba("#0f8c") == (0, 255, 136, 204)


def test_parses_long_rgba_with_whitespace_and_uppercase() -> None:
    assert hex_to_rgba("  #3366CC80 ") == (51, 102, 204, 128)


def test_rejects_invalid_lengths() -> None:
    with pytest.raises(ValueError):
        hex_to_rgba("#12")
